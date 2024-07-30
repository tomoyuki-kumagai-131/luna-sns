import React from 'react'
import Link from 'next/link'
import styles from './header.module.css'
import { useAuth } from '@/hooks/useAuth'
import { auth } from '@/libs/firebase'

export const Header = () => {
  const { user } = useAuth()

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Luna SNS
        </Link>
        <ul className={styles.navItems}>
          {user ? (
            <>
              <li>
                <Link href="/dashboard">DASHBOARD</Link>
              </li>
              <li>
                <button onClick={() => auth.signOut()}>LOGOUT</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">LOGIN</Link>
              </li>
              <li>
                <Link href="/signup">SIGN UP</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}
