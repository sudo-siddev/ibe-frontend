import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = (): JSX.Element => {
  return (
    <div className={styles.container} role="status" aria-label="Loading">
      <div className={styles.spinner}></div>
      <span className={styles.text}>Loading...</span>
    </div>
  );
};


