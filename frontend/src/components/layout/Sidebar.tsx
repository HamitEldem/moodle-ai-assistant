import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  MessageCircle, 
  Settings, 
  LogOut,
  Globe,
  User
} from 'lucide-react'
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'AI Assistant', href: '/chat', icon: MessageCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  return (
    <div className="flex flex-col h-full bg-dark-900/50 backdrop-blur-xl border-r border-dark-700/50">
      {/* Logo & User Info */}
      <div className="p-6 border-b border-dark-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-electric-500 to-neon-500 flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Moodle AI</h1>
            <p className="text-xs text-gray-400">Assistant</p>
          </div>
        </div>
        
        {user && (
          <div className="glass-dark p-3 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-electric-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-electric-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {user.fullname || user.username}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.sitename || 'Moodle User'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          
          return (
            <motion.button
              key={item.name}
              onClick={() => navigate(item.href)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200',
                isActive 
                  ? 'bg-gradient-to-r from-electric-500/20 to-neon-500/20 text-white border-r-2 border-electric-400' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </motion.button>
          )
        })}
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t border-dark-700/50">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Sidebar