import { ReactNode, useEffect, useState } from 'react'
import { auth, db } from '@/libs/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { Timestamp } from 'firebase/firestore'
import { DashBoard } from '@/components/pages/dash-board/dash-board'
import Image from 'next/image'
export interface UserData {
  username: string
  email: string
  birthdate: Timestamp
  gender: ReactNode
}

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData
          setUser(userData)
        }
        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>{user ? 'Luna Match - 投稿一覧' : 'Luna Match - 人々をつなぐSNS'}</title>
        <meta
          name="description"
          content={
            user ? 'Luna Matchの投稿一覧です' : 'Luna Match - 人々をつなぐソーシャルネットワーク'
          }
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        {user ? (
          // ログインしている場合のダッシュボード表示
          <DashBoard user={user} setUser={setUser} />
        ) : (
          // ログインしていない場合のホームページ表示
          <>
            <h1 className={styles.title}>Luna Match</h1>

            <div className={styles.heroSection}>
              <Image
                src="/images/luna-sns-hero.jpg"
                alt="Luna Match つながる人々"
                objectFit="cover"
                layout="fill"
                unoptimized
              />
            </div>

            <div className={styles.grid}>
              <div className={styles.card}>
                <h2>プロフィールを作成</h2>
                <p>
                  サインアップして、あなたの個性を表現するユニークなプロフィールを作成しましょう。
                </p>
              </div>
              <div className={styles.card}>
                <h2>他の人々とつながる</h2>
                <p>あなたの興味や価値観を共有する人々を見つけ、つながりましょう。</p>
              </div>
              <div className={styles.card}>
                <h2>考えを共有</h2>
                <p>近況を投稿し、アイデアを共有し、会話に参加しましょう。</p>
              </div>
              <div className={styles.card}>
                <h2>理想のパートナーを見つける</h2>
                <p>相性と共通の興味に基づいて、パートナーを発見しましょう。</p>
              </div>
            </div>
            <div className={styles.cta}>
              <Link href="/signup" className={styles.button}>
                始めましょう
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
