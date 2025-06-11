from fastapi import APIRouter, HTTPException, Header, Query
from typing import Optional, List
import logging

from ..models.schemas import Course, CourseContent
from ..services.moodle_client import MoodleClient
from ..utils.helpers import get_user_session

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/courses", tags=["courses"])


def get_moodle_client_from_session(session_id: str) -> MoodleClient:
    """Get MoodleClient instance from session"""
    session = get_user_session(session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    return MoodleClient(session['moodle_url'], session['token'])


@router.get("/", response_model=List[Course])
async def get_user_courses(session_id: Optional[str] = Header(None, alias="X-Session-ID")):
    """Get courses enrolled by current user"""
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    try:
        moodle_client = get_moodle_client_from_session(session_id)
        courses_data = await moodle_client.get_user_courses()
        
        # Convert to Course models
        courses = []
        for course_data in courses_data:
            try:
                # Map Moodle course data to our Course model
                course = Course(
                    id=course_data.get('id'),
                    fullname=course_data.get('fullname', ''),
                    shortname=course_data.get('shortname', ''),
                    categoryid=course_data.get('categoryid', 0),
                    summary=course_data.get('summary'),
                    summaryformat=course_data.get('summaryformat'),
                    format=course_data.get('format'),
                    showgrades=course_data.get('showgrades'),
                    newsitems=course_data.get('newsitems'),
                    startdate=course_data.get('startdate'),
                    enddate=course_data.get('enddate'),
                    maxbytes=course_data.get('maxbytes'),
                    showreports=course_data.get('showreports'),
                    visible=course_data.get('visible'),
                    groupmode=course_data.get('groupmode'),
                    groupmodeforce=course_data.get('groupmodeforce'),
                    defaultgroupingid=course_data.get('defaultgroupingid')
                )
                courses.append(course)
            except Exception as e:
                logger.warning(f"Could not parse course data: {e}")
                continue
        
        return courses
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get user courses: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve courses")


@router.get("/{course_id}", response_model=Course)
async def get_course(
    course_id: int,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """Get specific course information"""
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    try:
        moodle_client = get_moodle_client_from_session(session_id)
        courses_data = await moodle_client.get_course_by_field('id', course_id)
        
        if not courses_data:
            raise HTTPException(status_code=404, detail="Course not found")
        
        course_data = courses_data[0]
        
        course = Course(
            id=course_data.get('id'),
            fullname=course_data.get('fullname', ''),
            shortname=course_data.get('shortname', ''),
            categoryid=course_data.get('categoryid', 0),
            summary=course_data.get('summary'),
            summaryformat=course_data.get('summaryformat'),
            format=course_data.get('format'),
            showgrades=course_data.get('showgrades'),
            newsitems=course_data.get('newsitems'),
            startdate=course_data.get('startdate'),
            enddate=course_data.get('enddate'),
            maxbytes=course_data.get('maxbytes'),
            showreports=course_data.get('showreports'),
            visible=course_data.get('visible'),
            groupmode=course_data.get('groupmode'),
            groupmodeforce=course_data.get('groupmodeforce'),
            defaultgroupingid=course_data.get('defaultgroupingid')
        )
        
        return course
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get course {course_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve course")


@router.get("/{course_id}/contents", response_model=List[CourseContent])
async def get_course_contents(
    course_id: int,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """Get contents of a specific course"""
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    try:
        moodle_client = get_moodle_client_from_session(session_id)
        contents_data = await moodle_client.get_course_contents(course_id)
        
        # Convert to CourseContent models
        contents = []
        for content_data in contents_data:
            try:
                content = CourseContent(
                    id=content_data.get('id'),
                    name=content_data.get('name', ''),
                    visible=content_data.get('visible'),
                    summary=content_data.get('summary'),
                    summaryformat=content_data.get('summaryformat'),
                    section=content_data.get('section'),
                    hiddenbynumsections=content_data.get('hiddenbynumsections'),
                    uservisible=content_data.get('uservisible'),
                    modules=content_data.get('modules', [])
                )
                contents.append(content)
            except Exception as e:
                logger.warning(f"Could not parse content data: {e}")
                continue
        
        return contents
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get course {course_id} contents: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve course contents")


@router.get("/{course_id}/download")
async def download_course_files(
    course_id: int,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    file_type: Optional[str] = Query(None, description="Filter by file type (pdf, doc, etc.)")
):
    """Download all files from a course or specific file types"""
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    try:
        moodle_client = get_moodle_client_from_session(session_id)
        contents_data = await moodle_client.get_course_contents(course_id)
        
        files_info = []
        
        # Extract file information from course contents
        for section in contents_data:
            for module in section.get('modules', []):
                for content in module.get('contents', []):
                    if content.get('type') == 'file':
                        file_info = {
                            'filename': content.get('filename'),
                            'fileurl': content.get('fileurl'),
                            'filesize': content.get('filesize'),
                            'mimetype': content.get('mimetype'),
                            'module_name': module.get('name'),
                            'section_name': section.get('name')
                        }
                        
                        # Filter by file type if specified
                        if file_type:
                            file_ext = content.get('filename', '').split('.')[-1].lower()
                            if file_ext != file_type.lower():
                                continue
                        
                        files_info.append(file_info)
        
        return {
            "course_id": course_id,
            "files_count": len(files_info),
            "files": files_info,
            "message": f"Found {len(files_info)} files in course"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get course {course_id} files: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve course files")


@router.get("/{course_id}/files/{file_id}")
async def download_file(
    course_id: int,
    file_id: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """Download a specific file from a course"""
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # This would need to be implemented based on specific file URLs
    # For now, return placeholder
    return {
        "message": "File download endpoint - implementation depends on specific Moodle file URLs",
        "course_id": course_id,
        "file_id": file_id
    }