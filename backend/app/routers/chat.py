from fastapi import APIRouter, HTTPException, Header
from typing import Optional
import logging

from ..models.schemas import ChatMessage, ChatResponse
from ..utils.helpers import get_user_session

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """
    Chat endpoint for AI assistant (placeholder for future AI integration)
    
    This endpoint will be enhanced with:
    - Integration with OpenAI/Claude/other LLM APIs
    - Context awareness of user's courses and materials
    - Smart suggestions based on course content
    - File analysis and Q&A capabilities
    """
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    session = get_user_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    try:
        # Placeholder AI response logic
        user_message = message.message.lower()
        
        # Simple pattern matching for demonstration
        if "courses" in user_message or "course" in user_message:
            response_text = f"I can help you with your courses! You're connected to {session['moodle_url']}. Use the courses section to browse your enrolled courses and materials."
            suggestions = [
                "Show me my courses",
                "Help me find course materials",
                "What assignments are due?"
            ]
        elif "hello" in user_message or "hi" in user_message:
            user_name = session['user_info'].get('fullname', session['user_info'].get('username', 'there'))
            response_text = f"Hello {user_name}! I'm your AI learning assistant. I can help you navigate your Moodle courses, find materials, and answer questions about your coursework."
            suggestions = [
                "Show me my courses",
                "Help me organize my study materials",
                "What can you do?"
            ]
        elif "help" in user_message:
            response_text = """I'm your personalized AI Moodle assistant! Here's what I can help you with:

🎓 **Course Management**
- Browse your enrolled courses
- Access course materials and files
- Navigate course content

📚 **Study Support**
- Organize your learning materials
- Find specific resources
- Track your progress

💬 **Smart Assistance**
- Answer questions about your courses
- Provide study recommendations
- Help with course navigation

What would you like to explore first?"""
            suggestions = [
                "Show me my courses",
                "Help me find materials",
                "What assignments do I have?"
            ]
        else:
            response_text = f"I understand you're asking about: '{message.message}'. This is a prototype AI assistant. In the full version, I'll be able to provide intelligent responses based on your course content and learning materials."
            suggestions = [
                "Show me my courses",
                "Help me with my studies",
                "What can you do?"
            ]
        
        return ChatResponse(
            response=response_text,
            suggestions=suggestions
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat message")


@router.get("/suggestions")
async def get_chat_suggestions(session_id: Optional[str] = Header(None, alias="X-Session-ID")):
    """Get contextual chat suggestions based on user's courses and activity"""
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    session = get_user_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    # Return contextual suggestions
    suggestions = [
        "Show me my courses",
        "What materials are available?",
        "Help me organize my studies",
        "Find recent course updates",
        "What assignments are coming up?",
        "Help me prepare for exams",
        "Show me discussion forums",
        "Find lecture recordings"
    ]
    
    return {
        "suggestions": suggestions,
        "context": f"Connected to {session['moodle_url']}",
        "user": session['user_info'].get('fullname', session['user_info'].get('username'))
    }