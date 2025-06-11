import React from 'react'
import { Button } from '@/components/ui'
import { storage } from '@/utils'

const TestLogin: React.FC = () => {
  
  const handleTestLogin = () => {
    console.log('Test login triggered')
    
    // Create fake user data
    const fakeUser = {
      userid: 123,
      username: 'testuser',
      fullname: 'Test User',
      email: 'test@example.com',
      sitename: 'Test Moodle Site',
      moodle_url: 'https://moodle.example.com'
    }
    
    const fakeSessionId = 'test-session-123'
    
    // Store in localStorage
    storage.set('sessionId', fakeSessionId)
    storage.set('user', fakeUser)
    
    console.log('Test login complete - user should be authenticated')
    
    // Force a page reload to trigger authentication state change
    window.location.reload()
  }
  
  return (
    <div className="mt-4 p-4 glass-dark rounded-xl border border-yellow-500/20">
      <h3 className="text-sm font-medium text-yellow-400 mb-2">Development Testing</h3>
      <p className="text-xs text-gray-400 mb-3">
        Can't access a real Moodle instance? Use the test login to see the dashboard.
      </p>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleTestLogin}
        className="w-full"
      >
        Test Login (Skip Moodle)
      </Button>
    </div>
  )
}

export default TestLogin