from pydantic import BaseModel, HttpUrl, validator
from typing import Optional, List, Dict, Any
from datetime import datetime


class MoodleLoginRequest(BaseModel):
    moodle_url: str
    username: str
    password: str
    
    @validator('moodle_url')
    def validate_moodle_url(cls, v):
        if not v.startswith(('http://', 'https://')):
            v = f'https://{v}'
        if not v.endswith('/'):
            v = f'{v}/'
        return v


class MoodleLoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    user_info: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None
    message: Optional[str] = None


class UserSession(BaseModel):
    session_id: str
    moodle_url: str
    token: str
    user_info: Dict[str, Any]
    created_at: datetime
    last_accessed: datetime


class Course(BaseModel):
    id: int
    fullname: str
    shortname: str
    categoryid: int
    summary: Optional[str] = None
    summaryformat: Optional[int] = None
    format: Optional[str] = None
    showgrades: Optional[bool] = None
    newsitems: Optional[int] = None
    startdate: Optional[int] = None
    enddate: Optional[int] = None
    maxbytes: Optional[int] = None
    showreports: Optional[bool] = None
    visible: Optional[bool] = None
    groupmode: Optional[int] = None
    groupmodeforce: Optional[int] = None
    defaultgroupingid: Optional[int] = None


class CourseContent(BaseModel):
    id: int
    name: str
    visible: Optional[bool] = None
    summary: Optional[str] = None
    summaryformat: Optional[int] = None
    section: Optional[int] = None
    hiddenbynumsections: Optional[int] = None
    uservisible: Optional[bool] = None
    modules: Optional[List[Dict[str, Any]]] = []


class CourseModule(BaseModel):
    id: int
    url: Optional[str] = None
    name: str
    instance: Optional[int] = None
    description: Optional[str] = None
    visible: Optional[int] = None
    uservisible: Optional[bool] = None
    availabilityinfo: Optional[str] = None
    visibleoncoursepage: Optional[int] = None
    modicon: Optional[str] = None
    modname: Optional[str] = None
    modplural: Optional[str] = None
    availability: Optional[str] = None
    indent: Optional[int] = None
    onclick: Optional[str] = None
    afterlink: Optional[str] = None
    customdata: Optional[str] = None
    noviewlink: Optional[bool] = None
    completion: Optional[int] = None
    completiondata: Optional[Dict[str, Any]] = None
    contents: Optional[List[Dict[str, Any]]] = []


class FileContent(BaseModel):
    type: str
    filename: str
    filepath: Optional[str] = None
    filesize: Optional[int] = None
    fileurl: Optional[str] = None
    timecreated: Optional[int] = None
    timemodified: Optional[int] = None
    sortorder: Optional[int] = None
    userid: Optional[int] = None
    author: Optional[str] = None
    license: Optional[str] = None


class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None