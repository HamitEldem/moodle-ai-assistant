from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
from dotenv import load_dotenv

from .routers import auth, courses, chat
from .utils.helpers import cleanup_expired_sessions, get_active_sessions_count

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv('LOG_LEVEL', 'INFO').upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Moodle AI Assistant API",
    description="""
    A modern, dynamic Moodle integration API that works with any university's Moodle instance.
    
    ## Features
    
    * **Dynamic Authentication** - Connect to any Moodle instance with user credentials
    * **Course Management** - Browse enrolled courses and access materials
    * **File Access** - Download and organize course files
    * **AI Chat Interface** - Intelligent assistant for learning support
    * **Session Management** - Secure session handling without hardcoded credentials
    
    ## How it works
    
    1. Users provide their university's Moodle URL + credentials
    2. System validates the Moodle instance and authenticates
    3. Session is created with dynamic connection info  
    4. All subsequent API calls use the stored session data
    5. Works with ANY university's Moodle instance automatically
    
    ## Security
    
    - No hardcoded Moodle URLs or credentials
    - Session-based authentication
    - Automatic session cleanup
    - CORS protection
    """,
    version="1.0.0",
    contact={
        "name": "Moodle AI Assistant",
        "url": "https://github.com/HamitEldem/moodle-ai-assistant",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Moodle AI Assistant API",
        "version": "1.0.0",
        "description": "Dynamic Moodle integration that works with any university",
        "docs_url": "/docs",
        "active_sessions": get_active_sessions_count(),
        "features": [
            "Dynamic Moodle authentication",
            "Course and content access",
            "File management",
            "AI chat interface",
            "Session management"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "active_sessions": get_active_sessions_count(),
        "message": "Moodle AI Assistant API is running"
    }


@app.get("/api/status")
async def api_status():
    """API status and statistics"""
    # Clean up expired sessions
    cleaned_sessions = cleanup_expired_sessions()
    
    return {
        "status": "operational",
        "active_sessions": get_active_sessions_count(),
        "cleaned_sessions": cleaned_sessions,
        "endpoints": {
            "authentication": "/api/auth/*",
            "courses": "/api/courses/*", 
            "chat": "/api/chat/*"
        },
        "capabilities": [
            "Multi-university Moodle support",
            "Dynamic authentication",
            "Real-time session management",
            "Course content access",
            "AI-powered assistance"
        ]
    }


@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "message": "The requested endpoint does not exist",
            "available_endpoints": [
                "/docs - API documentation",
                "/api/auth/login - Authenticate with Moodle",
                "/api/courses - Get user courses",
                "/api/chat - AI assistant chat"
            ]
        }
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }
    )


# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Moodle AI Assistant API")
    logger.info(f"CORS origins: {cors_origins}")
    logger.info("API is ready to accept connections from any Moodle instance")


# Shutdown event
@app.on_event("shutdown")  
async def shutdown_event():
    logger.info("Shutting down Moodle AI Assistant API")
    # Clean up all sessions
    cleanup_expired_sessions()


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv('BACKEND_HOST', 'localhost')
    port = int(os.getenv('BACKEND_PORT', 8000))
    debug = os.getenv('DEBUG', 'true').lower() == 'true'
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level=os.getenv('LOG_LEVEL', 'info').lower()
    )