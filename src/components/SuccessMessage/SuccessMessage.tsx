import styles from './SuccessMessage.module.css';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const SuccessMessage = ({
  message,
  onDismiss,
}: SuccessMessageProps): JSX.Element => {
  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon}>✓</span>
      <span className={styles.message}>{message}</span>
      {onDismiss && (
        <button
          className={styles.dismissButton}
          onClick={onDismiss}
          type="button"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

