import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import styles from './NetworkError.module.css';

interface NetworkErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const NetworkError = ({
  message = "You're offline or our service is temporarily unavailable. Please check your connection and try again.",
  onRetry,
}: NetworkErrorProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <ErrorMessage message={message} />
      {onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          type="button"
          aria-label="Retry loading"
        >
          Retry
        </button>
      )}
    </div>
  );
};

