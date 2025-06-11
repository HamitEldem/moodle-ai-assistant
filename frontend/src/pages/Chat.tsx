import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/hooks/useAuth'

const Chat: React.FC = () => {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: `Hello ${user?.fullname?.split(' ')[0] || user?.username}! I'm your AI learning assistant. I can help you navigate your Moodle courses, understand course materials, and answer questions about your studies. What would you like to know?`,
      sender: 'ai' as const,
      timestamp: new Date(),
    }
  ])
  
  const suggestions = [
    "Show me my courses",
    "Help me organize my study materials",
    "What assignments are coming up?",
    "Explain this course topic",
    "Find my recent downloads",
    "Create a study schedule"
  ]
  
  const handleSendMessage = () => {
    if (!message.trim()) return
    
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, newMessage])
    setMessage('')
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${message}". This is a prototype AI assistant. In the full version, I'll be able to provide intelligent responses based on your course content and learning materials. For now, you can explore your courses in the Courses section!`,
        sender: 'ai' as const,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }
  
  return (
    <Layout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="p-8 pb-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Sparkles className="w-8 h-8 text-electric-400 mr-3" />
              AI Assistant
            </h1>
            <p className="text-gray-400 text-lg">
              Your intelligent learning companion
            </p>
          </motion.div>
        </div>
        
        {/* Chat Container */}
        <div className="flex-1 flex flex-col p-8 pt-4">
          <Card glass className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-2xl ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === 'user' 
                        ? 'bg-electric-500' 
                        : 'bg-gradient-to-r from-neon-500 to-purple-500'
                    }`}>
                      {msg.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-2xl p-4 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-electric-600 to-electric-500 text-white'
                        : 'glass-dark border-dark-600/50 text-gray-100'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-60 mt-2">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Suggestions */}
            <div className="p-6 border-t border-dark-700/50">
              <p className="text-sm text-gray-400 mb-3">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    onClick={() => setMessage(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Message Input */}
            <div className="p-6 border-t border-dark-700/50">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Ask me anything about your courses..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    glass
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default Chat