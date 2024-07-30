import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/libs/firebase'
import styles from './signup-form.module.css'
import { useRouter } from 'next/router'

const schema = yup.object().shape({
  username: yup.string().required('ユーザー名は必須です'),
  email: yup.string().email('無効なメールアドレスです').required('メールアドレスは必須です'),
  password: yup
    .string()
    .min(6, 'パスワードは6文字以上である必要があります')
    .required('パスワードは必須です'),
  birthdate: yup
    .date()
    .required('生年月日は必須です')
    .max(new Date(), '生年月日は今日以前である必要があります'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], '性別を選択してください')
    .required('性別は必須です'),
  agreeToTerms: yup.boolean().oneOf([true], '利用規約に同意する必要があります'),
})

type FormData = yup.InferType<typeof schema>

export const SignupForm = () => {
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
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const user = userCredential.user

      await updateProfile(user, {
        displayName: data.username,
      })

      await setDoc(doc(db, 'users', user.uid), {
        username: data.username,
        email: data.email,
        birthdate: data.birthdate,
        gender: data.gender,
        createdAt: new Date(),
      })

      router.push('/dashboard')
    } catch (error) {
      setError('登録中にエラーが発生しました。もう一度お試しください。')
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formGroup}>
        <label htmlFor="username">ユーザー名</label>
        <input type="text" id="username" {...register('username')} />
        {errors.username && <p className={styles.error}>{errors.username.message}</p>}
      </div>
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
      <div className={styles.formGroup}>
        <label htmlFor="birthdate">生年月日</label>
        <input type="date" id="birthdate" {...register('birthdate')} />
        {errors.birthdate && <p className={styles.error}>{errors.birthdate.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="gender">性別</label>
        <select id="gender" {...register('gender')}>
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
        {errors.gender && <p className={styles.error}>{errors.gender.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label>
          <input type="checkbox" {...register('agreeToTerms')} />
          <a
            href="https://luna-matching.notion.site/a714620bbd8740d1ac98f2326fbd0bbc"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.termsLink}
          >
            利用規約
          </a>
          に同意します
        </label>
        {errors.agreeToTerms && <p className={styles.error}>{errors.agreeToTerms.message}</p>}
      </div>
      <button type="submit" className={styles.submitButton}>
        登録
      </button>
    </form>
  )
}
