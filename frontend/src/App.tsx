import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import LoginForm from '@/components/auth/LoginForm'
import { LoadingSpinner } from '@/components/ui'

// Placeholder components for future implementation
const Dashboard = () => (
  <div className="min-h-screen bg-dark-950 text-white p-8">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Welcome to Moodle AI Assistant
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Your intelligent learning companion is ready to help!
        </p>
        <div className="glass-card p-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <ul className="text-left space-y-2 text-gray-300">
            <li>📚 Course browsing interface</li>
            <li>🤖 AI chat assistant</li>
            <li>📁 File management system</li>
            <li>📊 Learning analytics</li>
          </ul>
        </div>
      </motion.div>
    </div>
  </div>
)

const Courses = () => (
  <div className="min-h-screen bg-dark-950 text-white p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Courses</h1>
      <div className="glass-card p-8">
        <p className="text-gray-400">Course management interface coming soon...</p>
      </div>
    </div>
  </div>
)

const Chat = () => (
  <div className="min-h-screen bg-dark-950 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">AI Assistant</h1>
      <div className="glass-card p-8">
        <p className="text-gray-400">AI chat interface coming soon...</p>
      </div>
    </div>
  </div>
)

const App: React.FC = () => {
  const { isAuthenticated, isValidating } = useAuth()
  
  // Show loading spinner while validating session
  if (isValidating) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Validating session..." />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-dark-950">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginForm />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App