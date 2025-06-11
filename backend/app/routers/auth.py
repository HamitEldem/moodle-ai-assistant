from fastapi import APIRouter, HTTPException, Header
from typing import Optional
import logging

from ..models.schemas import MoodleLoginRequest, MoodleLoginResponse
from ..services.moodle_client import MoodleClient
from ..utils.helpers import create_user_session, get_user_session, delete_user_session

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/login", response_model=MoodleLoginResponse)
async def login(request: MoodleLoginRequest):
    """
    Authenticate with any Moodle instance dynamically
    
    This endpoint accepts:
    - moodle_url: The URL of the user's Moodle instance (e.g., https://moodle.university.edu)
    - username: User's Moodle username
    - password: User's Moodle password
    
    Returns session information for subsequent API calls
    """
    try:
        # Validate Moodle instance
        logger.info(f"Validating Moodle instance: {request.moodle_url}")
        is_valid = await MoodleClient.validate_moodle_instance(request.moodle_url)
        
        if not is_valid:
            return MoodleLoginResponse(
                success=False,
                message="Invalid Moodle URL. Please check that the URL is correct and accessible."
            )
        
        # Authenticate with Moodle
        logger.info(f"Authenticating user {request.username} with {request.moodle_url}")
        auth_result = await MoodleClient.authenticate(
            request.moodle_url,
            request.username,
            request.password
        )
        
        if not auth_result['success']:
            return MoodleLoginResponse(
                success=False,
                message=f"Authentication failed: {auth_result.get('error', 'Unknown error')}"
            )
        
        # Create user session
        session_id = create_user_session(
            moodle_url=request.moodle_url,
            token=auth_result['token'],
            user_info=auth_result['user_info']
        )
        
        # Get additional user info from Moodle
        try:
            moodle_client = MoodleClient(request.moodle_url, auth_result['token'])
            site_info = await moodle_client.get_user_info()
            
            # Update user info with site information
            user_info = {
                **auth_result['user_info'],
                'fullname': site_info.get('fullname', ''),
                'email': site_info.get('email', ''),
                'sitename': site_info.get('sitename', ''),
                'userid': site_info.get('userid')
            }
            
        except Exception as e:
            logger.warning(f"Could not fetch additional user info: {e}")
            user_info = auth_result['user_info']
        
        return MoodleLoginResponse(
            success=True,
            session_id=session_id,
            user_info=user_info,
            message="Authentication successful"
        )
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        return MoodleLoginResponse(
            success=False,
            message="An unexpected error occurred during authentication"
        )


@router.post("/logout")
async def logout(session_id: Optional[str] = Header(None, alias="X-Session-ID")):
    """Logout and invalidate session"""
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    success = delete_user_session(session_id)
    
    if success:
        return {"success": True, "message": "Logged out successfully"}
    else:
        return {"success": False, "message": "Session not found or already expired"}


@router.get("/validate")
async def validate_session(session_id: Optional[str] = Header(None, alias="X-Session-ID")):
    """Validate current session"""
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    session = get_user_session(session_id)
    
    if session:
        return {
            "valid": True,
            "user_info": session['user_info'],
            "moodle_url": session['moodle_url']
        }
    else:
        return {"valid": False, "message": "Session expired or invalid"}


@router.get("/session-info")
async def get_session_info(session_id: Optional[str] = Header(None, alias="X-Session-ID")):
    """Get current session information"""
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    session = get_user_session(session_id)
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    return {
        "session_id": session['session_id'],
        "user_info": session['user_info'],
        "moodle_url": session['moodle_url'],
        "created_at": session['created_at'].isoformat(),
        "last_accessed": session['last_accessed'].isoformat()
    }