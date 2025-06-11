import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Users, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui'
import { Course } from '@/types'
import { formatDate, truncateText } from '@/utils'

interface CourseCardProps {
  course: Course
  onClick?: () => void
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const startDate = course.startdate ? new Date(course.startdate * 1000) : null
  const endDate = course.enddate ? new Date(course.enddate * 1000) : null
  
  return (
    <Card hover glass className="course-card cursor-pointer" onClick={onClick}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-electric-500/20 to-neon-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-electric-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-white truncate">
                {course.fullname}
              </h3>
              <p className="text-sm text-gray-400">
                {course.shortname}
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {/* Description */}
        {course.summary && (
          <div className="text-sm text-gray-300">
            {truncateText(course.summary.replace(/<[^>]*>/g, ''), 120)}
          </div>
        )}
        
        {/* Course Info */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            {startDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Started {formatDate(startDate).split(',')[0]}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Course {course.id}</span>
            </div>
          </div>
          
          {course.visible !== false && (
            <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
              Active
            </div>
          )}
        </div>
        
        {/* Progress bar placeholder */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Progress</span>
            <span className="text-electric-400">Click to explore</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-1.5">
            <motion.div 
              className="bg-gradient-to-r from-electric-500 to-neon-500 h-1.5 rounded-full"
              style={{ width: '0%' }}
              whileHover={{ width: '20%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CourseCard