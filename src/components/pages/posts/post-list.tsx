import React, { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db, auth } from '@/libs/firebase'
import styles from '@/styles/post-list.module.css'
import Image from 'next/image'
interface Post {
  id: string
  content: string
  userId: string
  createdAt: Timestamp | null | undefined
}

export const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData: Post[] = []
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as Post)
      })
      setPosts(postsData)
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (postId: string) => {
    if (!auth.currentUser) return

    if (window.confirm('本当にこの投稿を削除しますか？')) {
      try {
        await deleteDoc(doc(db, 'posts', postId))
      } catch (error) {
        console.error('Error deleting post: ', error)
      }
    }
  }

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleString()
    }
    return 'Invalid date'
  }

  return (
    <div className={styles.postList}>
      {posts.map((post) => (
        <div key={post.id} className={styles.post}>
          <p>{post.content}</p>

          <small>{post.createdAt ? formatDate(post.createdAt) : 'No date'}</small>

          {auth.currentUser && auth.currentUser.uid === post.userId && (
            <button
              onClick={() => handleDelete(post.id)}
              className={styles.deleteButton}
              aria-label="投稿を削除"
            >
              <Image
                src="/icons/trash-icon.svg"
                width={20}
                height={20}
                alt="削除"
                className={styles.deleteIcon}
              />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
