import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Grid, List, BookOpen, Filter } from 'lucide-react'
import { Card, Button, Input, LoadingSpinner } from '@/components/ui'
import { useCourses } from '@/hooks/useCourses'
import CourseCard from '@/components/courses/CourseCard'
import Layout from '@/components/layout/Layout'

const Courses: React.FC = () => {
  const navigate = useNavigate()
  const { data: courses, isLoading, error } = useCourses()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const filteredCourses = courses?.filter(course =>
    course.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.shortname.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []
  
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
            My Courses
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Explore your enrolled courses and materials
          </motion.p>
        </div>
        
        {/* Controls */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} />}
              glass
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <Filter size={16} />
              Filter
            </Button>
          </div>
        </motion.div>
        
        {/* Course Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glass className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-electric-400">
                  {courses?.length || 0}
                </p>
                <p className="text-sm text-gray-400">Total Courses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-neon-400">
                  {filteredCourses.length}
                </p>
                <p className="text-sm text-gray-400">Filtered Results</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">
                  {courses?.filter(c => c.visible !== false).length || 0}
                </p>
                <p className="text-sm text-gray-400">Active Courses</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Courses Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading your courses..." />
            </div>
          ) : error ? (
            <Card glass className="p-8 text-center">
              <BookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Courses</h3>
              <p className="text-gray-400 mb-4">
                There was an error connecting to your Moodle instance. Please check your connection.
              </p>
              <div className="space-x-4">
                <Button 
                  variant="primary" 
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/chat')}
                >
                  Ask AI for Help
                </Button>
              </div>
            </Card>
          ) : filteredCourses.length === 0 ? (
            <Card glass className="p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No Courses Found' : 'No Courses Available'}
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm 
                  ? `No courses match "${searchTerm}". Try a different search term.`
                  : 'You don\'t seem to be enrolled in any courses yet.'
                }
              </p>
              {searchTerm && (
                <Button 
                  variant="primary" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
            </Card>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
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
        
        {/* Load More (if needed) */}
        {filteredCourses.length > 0 && (
          <motion.div
            className="flex justify-center pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-gray-400 text-sm">
              Showing all {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}

export default Courses