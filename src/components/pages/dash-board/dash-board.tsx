import styles from '@/styles/dash-board.module.css'
import { Timestamp } from 'firebase/firestore'
import { ReactNode, useEffect, useState } from 'react'
import { auth, db } from '@/libs/firebase'
import type { UserData } from '@/pages/index'
import { PostForm } from '@/components/pages/posts/post-form'
import { PostList } from '@/components/pages/posts/post-list'

type DashBoardProps = {
  user: UserData
  setUser: (user: UserData | null) => void
}

export const DashBoard = ({ user, setUser }: DashBoardProps) => {
  const handleLogout = async () => {
    try {
      await auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout failed', error)
    }
  }
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate()
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatGender = (gender: ReactNode) => {
    if (gender === 'male') {
      return '男性'
    } else if (gender === 'female') {
      return '女性'
    } else {
      return 'その他'
    }
  }

  return (
    <>
      <h1 className={styles.title}>投稿一覧</h1>
      <div className={styles.userInfo}>
        <p>ようこそ、{user.username}さん！</p>
        <p>メールアドレス: {user.email}</p>
        <p>生年月日: {formatDate(user.birthdate)}</p>
        <p>性別: {formatGender(user.gender)}</p>
      </div>

      <PostForm />
      <PostList />
    </>
  )
}
