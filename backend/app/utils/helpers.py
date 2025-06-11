import uuid
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

# In-memory session storage (for production, use Redis or database)
USER_SESSIONS: Dict[str, Dict[str, Any]] = {}


def generate_session_id() -> str:
    """Generate a unique session ID"""
    return str(uuid.uuid4())


def create_user_session(moodle_url: str, token: str, user_info: Dict[str, Any]) -> str:
    """Create a new user session"""
    session_id = generate_session_id()
    
    session_data = {
        'session_id': session_id,
        'moodle_url': moodle_url,
        'token': token,
        'user_info': user_info,
        'created_at': datetime.utcnow(),
        'last_accessed': datetime.utcnow()
    }
    
    USER_SESSIONS[session_id] = session_data
    logger.info(f"Created session {session_id} for user {user_info.get('username')}")
    
    return session_id


def get_user_session(session_id: str) -> Optional[Dict[str, Any]]:
    """Get user session by session ID"""
    if session_id in USER_SESSIONS:
        session = USER_SESSIONS[session_id]
        
        # Update last accessed time
        session['last_accessed'] = datetime.utcnow()
        
        # Check if session is expired (24 hours)
        if datetime.utcnow() - session['created_at'] > timedelta(hours=24):
            del USER_SESSIONS[session_id]
            return None
            
        return session
    
    return None


def delete_user_session(session_id: str) -> bool:
    """Delete a user session"""
    if session_id in USER_SESSIONS:
        del USER_SESSIONS[session_id]
        logger.info(f"Deleted session {session_id}")
        return True
    return False


def cleanup_expired_sessions():
    """Clean up expired sessions (call periodically)"""
    expired_sessions = []
    current_time = datetime.utcnow()
    
    for session_id, session_data in USER_SESSIONS.items():
        if current_time - session_data['created_at'] > timedelta(hours=24):
            expired_sessions.append(session_id)
    
    for session_id in expired_sessions:
        del USER_SESSIONS[session_id]
        logger.info(f"Cleaned up expired session {session_id}")
    
    return len(expired_sessions)


def get_active_sessions_count() -> int:
    """Get count of active sessions"""
    return len(USER_SESSIONS)


def validate_session_token(session_id: str) -> bool:
    """Validate if session exists and is active"""
    return get_user_session(session_id) is not None