import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Luna Match - 人々をつなぐマッチングアプリ</title>
        <meta name="description" content="Luna Match - 人々をつなぐマッチングアプリ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
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

        <p className={styles.description}>
          他の人々とつながり、あなたの考えを共有し、理想のパートナーを見つけましょう！
        </p>
        <div className={styles.cta}>
          <p className={styles.ctaText}>\今すぐ無料で始めましょう！/</p>
          <Link href="/signup" className={styles.button}>
            START
          </Link>
        </div>

        <div className={styles.grid}>
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
      </div>
    </>
  )
}
