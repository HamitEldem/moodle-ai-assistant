import React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Globe, User, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { LoginRequest } from '@/types'
import { normalizeMoodleUrl, isValidUrl } from '@/utils'

interface LoginFormData {
  moodle_url: string
  username: string
  password: string
}

const LoginForm: React.FC = () => {
  const { login, isLoggingIn, loginError } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<LoginFormData>()
  
  const moodleUrl = watch('moodle_url')
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Normalize and validate URL
      const normalizedUrl = normalizeMoodleUrl(data.moodle_url)
      
      if (!isValidUrl(normalizedUrl)) {
        setError('moodle_url', {
          type: 'manual',
          message: 'Please enter a valid URL'
        })
        return
      }
      
      const credentials: LoginRequest = {
        moodle_url: normalizedUrl,
        username: data.username,
        password: data.password
      }
      
      console.log('Submitting login with credentials:', credentials)
      const result = await login(credentials)
      console.log('Login result:', result)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-electric-500 to-neon-500 mb-6 glow-blue">
            <Globe className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Moodle AI Assistant
          </h1>
          
          <p className="text-gray-400">
            Connect to your university's Moodle instance
          </p>
        </motion.div>
        
        {/* Login Form */}
        <Card glass className="border-dark-700/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Moodle URL Input */}
            <div>
              <Input
                label="Moodle URL"
                icon={<Globe size={20} />}
                placeholder="https://moodle.university.edu"
                error={errors.moodle_url?.message}
                {...register('moodle_url', {
                  required: 'Moodle URL is required',
                  validate: (value) => {
                    const normalized = normalizeMoodleUrl(value)
                    return isValidUrl(normalized) || 'Please enter a valid URL'
                  }
                })}
              />
              
              {moodleUrl && !errors.moodle_url && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-3 glass-dark rounded-lg border border-green-500/20"
                >
                  <div className="flex items-center space-x-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>Will connect to: {normalizeMoodleUrl(moodleUrl)}</span>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Username Input */}
            <Input
              label="Username"
              icon={<User size={20} />}
              placeholder="Your Moodle username"
              error={errors.username?.message}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 2,
                  message: 'Username must be at least 2 characters'
                }
              })}
            />
            
            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              icon={<Lock size={20} />}
              placeholder="Your Moodle password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 1,
                  message: 'Password is required'
                }
              })}
            />
            
            {/* Error Display */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 glass-dark border border-red-500/20 rounded-lg"
              >
                <div className="flex items-center space-x-3 text-red-400">
                  <AlertCircle size={20} />
                  <div>
                    <p className="font-medium">Connection Failed</p>
                    <p className="text-sm text-red-300 mt-1">
                      {(loginError as any)?.response?.data?.message || 'Unable to connect to Moodle'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoggingIn}
              className="group"
            >
              {isLoggingIn ? 'Connecting...' : 'Connect to Moodle'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Card>
        
        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="glass-dark p-4 rounded-xl border border-dark-700/50">
            <h3 className="text-sm font-medium text-white mb-2">How it works:</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Enter your university's Moodle URL</li>
              <li>• Use your regular Moodle login credentials</li>
              <li>• AI assistant will help you navigate courses</li>
              <li>• Works with any university's Moodle instance</li>
            </ul>
          </div>
          
          <p className="text-xs text-gray-500">
            Your credentials are never stored and only used to authenticate with your Moodle instance.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginForm