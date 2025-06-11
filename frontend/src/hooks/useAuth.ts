import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { apiClient } from '@/services/api'
import { LoginRequest, UserInfo } from '@/types'
import { storage } from '@/utils'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const queryClient = useQueryClient()
  
  // Check for existing session on mount
  useEffect(() => {
    const sessionId = storage.get<string>('sessionId')
    const savedUser = storage.get<UserInfo>('user')
    
    if (sessionId && savedUser) {
      setIsAuthenticated(true)
      setUser(savedUser)
    }
  }, [])
  
  // Validate session query
  const { data: sessionData, isLoading: isValidating } = useQuery({
    queryKey: ['session', 'validate'],
    queryFn: apiClient.validateSession,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    onError: () => {
      logout()
    }
  })
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.user_info && data.session_id) {
        setIsAuthenticated(true)
        setUser(data.user_info)
        toast.success('Successfully connected to Moodle!')
        queryClient.invalidateQueries({ queryKey: ['session'] })
      } else {
        toast.error(data.message || 'Authentication failed')
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Connection failed'
      toast.error(message)
    }
  })
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: apiClient.logout,
    onSettled: () => {
      setIsAuthenticated(false)
      setUser(null)
      queryClient.clear()
      toast.success('Logged out successfully')
    }
  })
  
  const login = useCallback((credentials: LoginRequest) => {
    return loginMutation.mutateAsync(credentials)
  }, [loginMutation])
  
  const logout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])
  
  return {
    // State
    isAuthenticated,
    user,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    isValidating,
    
    // Actions
    login,
    logout,
    
    // Validation
    isSessionValid: sessionData?.valid ?? false,
    
    // Login state
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  }
}