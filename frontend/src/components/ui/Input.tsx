import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  glass?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  glass = true,
  className,
  type,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'w-full px-4 py-3 rounded-xl border transition-all duration-200 focus-ring',
            glass 
              ? 'glass-dark bg-dark-800/50 border-dark-600/50 focus:border-electric-500/50 focus:bg-dark-700/50' 
              : 'bg-dark-800 border-dark-600 focus:border-electric-500',
            'text-white placeholder-gray-400',
            'hover:border-dark-500/70',
            icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input