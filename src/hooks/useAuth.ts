import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { auth } from '@/libs/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return { user }
}
