import { SignupForm } from '@/components/auth/signup/signup-form'
import Head from 'next/head'
import styles from './signup.module.css'
import Link from 'next/link'

function SignupPage() {
  return (
    <>
      <Head>
        <title>Luna SNS - 新規登録</title>
        <meta name="description" content="Luna SNSに新規登録して、新しい出会いを見つけましょう" />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Luna SNS アカウント作成</h1>
        <SignupForm />
        <p className={styles.loginPrompt}>
          すでにアカウントをお持ちの方は<Link href="/login">こちら</Link>からログインしてください。
        </p>
      </div>
    </>
  )
}

export default SignupPage
