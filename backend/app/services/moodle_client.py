import httpx
import asyncio
from typing import Dict, List, Optional, Any
from urllib.parse import urljoin, urlparse
import logging

logger = logging.getLogger(__name__)


class MoodleClient:
    """Dynamic Moodle client that works with any Moodle instance"""
    
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url.rstrip('/')
        self.token = token
        self.webservice_url = f"{self.base_url}/webservice/rest/server.php"
        
    @staticmethod
    async def validate_moodle_instance(moodle_url: str) -> bool:
        """Check if the URL is a valid Moodle instance"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Try to access the login token endpoint
                token_url = f"{moodle_url.rstrip('/')}/login/token.php"
                response = await client.get(token_url)
                
                # Moodle should return some response (even error) for token endpoint
                if response.status_code == 200:
                    return True
                    
                # Also try the main page to see if it's Moodle
                main_response = await client.get(moodle_url)
                content = main_response.text.lower()
                
                return 'moodle' in content or 'moodleform' in content
                
        except Exception as e:
            logger.error(f"Failed to validate Moodle instance {moodle_url}: {e}")
            return False
    
    @staticmethod
    async def authenticate(moodle_url: str, username: str, password: str) -> Dict[str, Any]:
        """Authenticate with Moodle and get token"""
        try:
            token_url = f"{moodle_url.rstrip('/')}/login/token.php"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                data = {
                    'username': username,
                    'password': password,
                    'service': 'moodle_mobile_app'
                }
                
                response = await client.post(token_url, data=data)
                response.raise_for_status()
                
                result = response.json()
                
                if 'token' in result:
                    return {
                        'success': True,
                        'token': result['token'],
                        'user_info': {
                            'userid': result.get('userid'),
                            'username': username,
                            'moodle_url': moodle_url
                        }
                    }
                else:
                    return {
                        'success': False,
                        'error': result.get('error', 'Authentication failed'),
                        'errorcode': result.get('errorcode', 'unknown')
                    }
                    
        except httpx.TimeoutException:
            return {
                'success': False,
                'error': 'Connection timeout - please check your Moodle URL',
                'errorcode': 'timeout'
            }
        except httpx.HTTPStatusError as e:
            return {
                'success': False,
                'error': f'HTTP error {e.response.status_code}',
                'errorcode': 'http_error'
            }
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return {
                'success': False,
                'error': 'Failed to connect to Moodle',
                'errorcode': 'connection_error'
            }
    
    async def _make_request(self, function: str, **params) -> Dict[str, Any]:
        """Make a request to Moodle Web Service API"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                data = {
                    'wstoken': self.token,
                    'wsfunction': function,
                    'moodlewsrestformat': 'json',
                    **params
                }
                
                response = await client.post(self.webservice_url, data=data)
                response.raise_for_status()
                
                result = response.json()
                
                if isinstance(result, dict) and 'exception' in result:
                    raise Exception(f"Moodle API Error: {result.get('message', 'Unknown error')}")
                
                return result
                
        except Exception as e:
            logger.error(f"Moodle API request failed: {e}")
            raise
    
    async def get_user_info(self) -> Dict[str, Any]:
        """Get current user information"""
        return await self._make_request('core_webservice_get_site_info')
    
    async def get_user_courses(self) -> List[Dict[str, Any]]:
        """Get courses enrolled by current user"""
        try:
            # First get user info to get userid
            site_info = await self.get_user_info()
            userid = site_info.get('userid')
            
            if not userid:
                raise Exception("Could not get user ID")
            
            # Get enrolled courses
            result = await self._make_request('core_enrol_get_users_courses', userid=userid)
            return result if isinstance(result, list) else []
            
        except Exception as e:
            logger.error(f"Failed to get user courses: {e}")
            return []
    
    async def get_course_contents(self, course_id: int) -> List[Dict[str, Any]]:
        """Get contents of a specific course"""
        try:
            result = await self._make_request('core_course_get_contents', courseid=course_id)
            return result if isinstance(result, list) else []
            
        except Exception as e:
            logger.error(f"Failed to get course contents for course {course_id}: {e}")
            return []
    
    async def get_course_by_field(self, field: str = 'id', value: Any = None) -> List[Dict[str, Any]]:
        """Get course information by field"""
        try:
            result = await self._make_request(
                'core_course_get_courses_by_field',
                field=field,
                value=value
            )
            
            if isinstance(result, dict) and 'courses' in result:
                return result['courses']
            
            return result if isinstance(result, list) else []
            
        except Exception as e:
            logger.error(f"Failed to get course by {field}={value}: {e}")
            return []
    
    async def download_file(self, file_url: str) -> bytes:
        """Download a file from Moodle"""
        try:
            # Add token to file URL
            separator = '&' if '?' in file_url else '?'
            download_url = f"{file_url}{separator}token={self.token}"
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.get(download_url)
                response.raise_for_status()
                return response.content
                
        except Exception as e:
            logger.error(f"Failed to download file {file_url}: {e}")
            raise