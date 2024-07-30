import { LoginForm } from '@/components/auth/login/login-form'
import Head from 'next/head'
import styles from './login.module.css'

function LoginPage() {
  return (
    <>
      <Head>
        <title>Luna SNS - ログイン</title>
        <meta name="description" content="Luna SNSにログインして、つながりを広げましょう" />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Luna SNS へようこそ</h1>
        <LoginForm />
        <p className={styles.signupPrompt}>
          アカウントをお持ちでない方は<a href="/signup">こちら</a>から登録してください。
        </p>
      </div>
    </>
  )
}

export default LoginPage
