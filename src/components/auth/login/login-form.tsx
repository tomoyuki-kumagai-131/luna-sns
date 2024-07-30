import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/libs/firebase'
import styles from './login-form.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'

const schema = yup.object().shape({
  //
  email: yup.string().email('無効なメールアドレスです').required('メールアドレスは必須です'),
  password: yup.string().required('パスワードは必須です'),
})

type FormData = yup.InferType<typeof schema>

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      router.push('/dashboard')
    } catch (error) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
      console.error(error)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>ログイン</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="email">メールアドレス</label>
          <input type="email" id="email" {...register('email')} />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">パスワード</label>
          <input type="password" id="password" {...register('password')} />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>
        <button type="submit" className={styles.submitButton}>
          ログイン
        </button>
      </form>
      <div className={styles.forgotPassword}>
        <Link href="/forgot-password">パスワードをお忘れですか？</Link>
      </div>
    </div>
  )
}
