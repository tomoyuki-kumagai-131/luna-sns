import React, { useState, KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/libs/firebase'
import styles from '@/styles/post-form.module.css'

type FormData = yup.InferType<typeof schema>

const MAX_CONTENT_LENGTH = 140

const schema = yup.object().shape({
  content: yup
    .string()
    .required('投稿内容は必須です')
    .min(1, '1文字以上入力してください')
    .max(MAX_CONTENT_LENGTH, `${MAX_CONTENT_LENGTH}文字以内で入力してください`)
    .trim(),
})

export const PostForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const content = watch('content')
  const contentLength = content ? content.length : 0
  const isMaxLength = contentLength === MAX_CONTENT_LENGTH

  const onSubmit = async (data: FormData) => {
    if (!auth.currentUser) return

    try {
      await addDoc(collection(db, 'posts'), {
        content: data.content,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      })
      reset()
    } catch (error) {
      console.error('Error adding post: ', error)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <textarea
        {...register('content')}
        placeholder="What's happening?!"
        className={styles.textarea}
        maxLength={MAX_CONTENT_LENGTH}
        onKeyDown={handleKeyDown}
      />
      <div className={`${styles.charCount} ${isMaxLength ? styles.maxLength : ''}`}>
        {contentLength}/{MAX_CONTENT_LENGTH}
      </div>
      {errors.content && <p className={styles.errorMessage}>{errors.content.message}</p>}
      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        Post
      </button>
    </form>
  )
}
