import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addDoc, collection } from 'firebase/firestore'
import { db, auth } from '@/libs/firebase'
import styles from './PostForm.module.css'

const schema = yup.object().shape({
  content: yup.string().required('投稿内容は必須です').max(140, '140文字以内で入力してください'),
})

type FormData = yup.InferType<typeof schema>

const PostForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    try {
      const user = auth.currentUser
      if (!user) {
        setError('ログインしていません')
        return
      }

      await addDoc(collection(db, 'posts'), {
        content: data.content,
        userId: user.uid,
        createdAt: new Date(),
      })

      reset()
      setError(null)
    } catch (error) {
      setError('投稿に失敗しました')
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formGroup}>
        <textarea
          {...register('content')}
          placeholder="What's on your mind?"
          className={styles.textarea}
        />
        {errors.content && <p className={styles.error}>{errors.content.message}</p>}
      </div>
      <button type="submit" className={styles.submitButton}>
        投稿
      </button>
    </form>
  )
}

export default PostForm
