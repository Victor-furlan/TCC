import styles from './Home.module.css';

export function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>MindCash</h1>
      <p className={styles.subtitle}>O gasto com significado.</p>
    </div>
  );
}
