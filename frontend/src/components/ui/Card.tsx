import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'
import { CardProps } from '@/types'

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  glass = true,
  ...props
}) => {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -4,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      } : {}}
      className={cn(
        baseClasses,
        glass ? 'glass-card' : 'bg-dark-800 border border-dark-700',
        hover && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card