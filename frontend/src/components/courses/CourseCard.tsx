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
    <Card hover glass className="course-card cursor-pointer overflow-hidden" onClick={onClick}>
      <div className="space-y-4 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-electric-500/20 to-neon-500/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-electric-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-white truncate" title={course.fullname}>
                {course.fullname}
              </h3>
              <p className="text-sm text-gray-400 truncate" title={course.shortname}>
                {course.shortname}
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
        
        {/* Description */}
        {course.summary && (
          <div className="text-sm text-gray-300 line-clamp-3" title={course.summary.replace(/<[^>]*>/g, '')}>
            {truncateText(course.summary.replace(/<[^>]*>/g, ''), 120)}
          </div>
        )}
        
        {/* Course Info */}
        <div className="flex items-center justify-between text-xs text-gray-400 gap-2">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {startDate && (
              <div className="flex items-center space-x-1 min-w-0">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">Started {formatDate(startDate).split(',')[0]}</span>
              </div>
            )}
            <div className="flex items-center space-x-1 min-w-0">
              <Users className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Course {course.id}</span>
            </div>
          </div>
          
          {course.visible !== false && (
            <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex-shrink-0">
              Active
            </div>
          )}
        </div>
        
        {/* Progress bar placeholder */}
        <div className="space-y-2 min-w-0">
          <div className="flex justify-between text-xs gap-2">
            <span className="text-gray-400 flex-shrink-0">Progress</span>
            <span className="text-electric-400 truncate">Click to explore</span>
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