import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BookOpen, MessageCircle, TrendingUp, Clock, Plus } from 'lucide-react'
import { Card, Button, LoadingSpinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useCourses } from '@/hooks/useCourses'
import CourseCard from '@/components/courses/CourseCard'
import Layout from '@/components/layout/Layout'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: courses, isLoading, error } = useCourses()
  
  const stats = [
    {
      name: 'Total Courses',
      value: courses?.length || 0,
      icon: BookOpen,
      color: 'from-electric-500 to-electric-600',
      change: '+2 this semester',
    },
    {
      name: 'AI Conversations',
      value: '0',
      icon: MessageCircle,
      color: 'from-neon-500 to-neon-600',
      change: 'Start chatting!',
    },
    {
      name: 'Learning Progress',
      value: '0%',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: 'Begin your journey',
    },
    {
      name: 'Time Saved',
      value: '0 hrs',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      change: 'With AI assistance',
    },
  ]
  
  return (
    <Layout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <motion.h1 
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome back, {user?.fullname?.split(' ')[0] || user?.username}! 👋
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your AI-powered learning dashboard is ready
          </motion.p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glass className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">{stat.name}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glass className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/courses')}
                className="justify-start"
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Browse My Courses
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/chat')}
                className="justify-start"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Chat with AI
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/courses')}
                className="justify-start"
              >
                <Plus className="w-5 h-5 mr-3" />
                Explore Features
              </Button>
            </div>
          </Card>
        </motion.div>
        
        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Your Courses</h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/courses')}
            >
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading your courses..." />
            </div>
          ) : error ? (
            <Card glass className="p-8 text-center">
              <p className="text-red-400 mb-4">Unable to load courses</p>
              <p className="text-gray-400 text-sm">
                Please check your Moodle connection or try refreshing the page
              </p>
              <Button 
                variant="primary" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </Card>
          ) : courses?.length === 0 ? (
            <Card glass className="p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Courses Found</h3>
              <p className="text-gray-400 mb-4">
                You don't seem to be enrolled in any courses yet, or they might not be visible.
              </p>
              <Button variant="primary" onClick={() => navigate('/chat')}>
                Ask AI Assistant for Help
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.slice(0, 6).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <CourseCard 
                    course={course}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}

export default Dashboard