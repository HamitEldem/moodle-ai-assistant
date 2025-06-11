import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { 
  LoginRequest, 
  LoginResponse, 
  Course, 
  CourseContent, 
  ChatRequest, 
  ChatResponse,
  UserSession 
} from '@/types'
import { storage } from '@/utils'

class ApiClient {
  private client: AxiosInstance
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // Request interceptor to add session ID
    this.client.interceptors.request.use((config) => {
      const sessionId = storage.get<string>('sessionId')
      if (sessionId) {
        config.headers['X-Session-ID'] = sessionId
      }
      return config
    })
    
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear session on unauthorized
          storage.remove('sessionId')
          storage.remove('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }
  
  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await this.client.post<LoginResponse>('/api/auth/login', credentials)
    
    if (data.success && data.session_id) {
      storage.set('sessionId', data.session_id)
      storage.set('user', data.user_info)
    }
    
    return data
  }
  
  async logout(): Promise<void> {
    try {
      await this.client.post('/api/auth/logout')
    } finally {
      storage.remove('sessionId')
      storage.remove('user')
    }
  }
  
  async validateSession(): Promise<{ valid: boolean; user_info?: any; moodle_url?: string }> {
    const { data } = await this.client.get('/api/auth/validate')
    return data
  }
  
  async getSessionInfo(): Promise<UserSession> {
    const { data } = await this.client.get('/api/auth/session-info')
    return data
  }
  
  // Course endpoints
  async getCourses(): Promise<Course[]> {
    const { data } = await this.client.get<Course[]>('/api/courses/')
    return data
  }
  
  async getCourse(courseId: number): Promise<Course> {
    const { data } = await this.client.get<Course>(`/api/courses/${courseId}`)
    return data
  }
  
  async getCourseContents(courseId: number): Promise<CourseContent[]> {
    const { data } = await this.client.get<CourseContent[]>(`/api/courses/${courseId}/contents`)
    return data
  }
  
  async getCourseFiles(courseId: number, fileType?: string): Promise<any> {
    const params = fileType ? { file_type: fileType } : {}
    const { data } = await this.client.get(`/api/courses/${courseId}/download`, { params })
    return data
  }
  
  // Chat endpoints
  async sendMessage(message: ChatRequest): Promise<ChatResponse> {
    const { data } = await this.client.post<ChatResponse>('/api/chat/', message)
    return data
  }
  
  async getChatSuggestions(): Promise<{ suggestions: string[]; context: string; user: string }> {
    const { data } = await this.client.get('/api/chat/suggestions')
    return data
  }
  
  // Health check
  async healthCheck(): Promise<any> {
    const { data } = await this.client.get('/health')
    return data
  }
  
  // API status
  async getApiStatus(): Promise<any> {
    const { data } = await this.client.get('/api/status')
    return data
  }
}

export const apiClient = new ApiClient()
export default apiClient