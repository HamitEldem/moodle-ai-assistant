// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authentication Types
export interface LoginRequest {
  moodle_url: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user_info?: UserInfo;
  session_id?: string;
  message?: string;
}

export interface UserInfo {
  userid?: number;
  username: string;
  fullname?: string;
  email?: string;
  sitename?: string;
  moodle_url: string;
}

export interface UserSession {
  session_id: string;
  moodle_url: string;
  token: string;
  user_info: UserInfo;
  created_at: string;
  last_accessed: string;
}

// Course Types
export interface Course {
  id: number;
  fullname: string;
  shortname: string;
  categoryid: number;
  summary?: string;
  summaryformat?: number;
  format?: string;
  showgrades?: boolean;
  newsitems?: number;
  startdate?: number;
  enddate?: number;
  maxbytes?: number;
  showreports?: boolean;
  visible?: boolean;
  groupmode?: number;
  groupmodeforce?: number;
  defaultgroupingid?: number;
}

export interface CourseContent {
  id: number;
  name: string;
  visible?: boolean;
  summary?: string;
  summaryformat?: number;
  section?: number;
  hiddenbynumsections?: number;
  uservisible?: boolean;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: number;
  url?: string;
  name: string;
  instance?: number;
  description?: string;
  visible?: number;
  uservisible?: boolean;
  availabilityinfo?: string;
  visibleoncoursepage?: number;
  modicon?: string;
  modname?: string;
  modplural?: string;
  availability?: string;
  indent?: number;
  onclick?: string;
  afterlink?: string;
  customdata?: string;
  noviewlink?: boolean;
  completion?: number;
  completiondata?: Record<string, any>;
  contents?: FileContent[];
}

export interface FileContent {
  type: string;
  filename: string;
  filepath?: string;
  filesize?: number;
  fileurl?: string;
  timecreated?: number;
  timemodified?: number;
  sortorder?: number;
  userid?: number;
  author?: string;
  license?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: Record<string, any>;
}

export interface ChatRequest {
  message: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
}

// UI State Types
export interface AppState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  sessionId: string | null;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: number;
}

// Loading and Error States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// File Types
export interface FileInfo {
  filename: string;
  fileurl: string;
  filesize: number;
  mimetype?: string;
  module_name: string;
  section_name: string;
}

export interface DownloadInfo {
  course_id: number;
  files_count: number;
  files: FileInfo[];
  message: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'url' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, any>;
  options?: { value: string; label: string }[];
}

// Component Props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Utility Types
export type Theme = 'dark' | 'light';
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type FileType = 'pdf' | 'doc' | 'img' | 'video' | 'audio' | 'zip' | 'default';