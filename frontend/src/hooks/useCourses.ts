import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/api'
import { Course } from '@/types'

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => apiClient.getCourses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}

export const useCourse = (courseId: number) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => apiClient.getCourse(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCourseContents = (courseId: number) => {
  return useQuery({
    queryKey: ['course-contents', courseId],
    queryFn: () => apiClient.getCourseContents(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  })
}