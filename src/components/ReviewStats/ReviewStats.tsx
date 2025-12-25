import { useReviewStats } from '../../hooks/useReviewStats';
import { isNetworkOrServerError } from '../../utils/errorClassification';
import { NetworkError } from '../NetworkError/NetworkError';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import styles from './ReviewStats.module.css';

interface ReviewStatsProps {
  roomId: string;
}

export const ReviewStats = ({ roomId }: ReviewStatsProps): JSX.Element => {
  const { stats, loading, error, refetch } = useReviewStats(roomId);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    if (isNetworkOrServerError(error)) {
      return (
        <div className={styles.container}>
          <NetworkError onRetry={refetch} />
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const hasReviews = stats.totalReviews > 0;
  const averageRating = stats.averageRating ?? 0;
  const displayRating = hasReviews && stats.averageRating !== null 
    ? stats.averageRating.toFixed(1) 
    : '—';

  const renderStars = (rating: number): JSX.Element[] => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return (
          <span key={index} className={styles.starFilled} aria-hidden="true">
            ★
          </span>
        );
      }
      if (index === fullStars && hasHalfStar) {
        return (
          <span key={index} className={styles.starHalf} aria-hidden="true">
            ★
          </span>
        );
      }
      return (
        <span key={index} className={styles.starEmpty} aria-hidden="true">
          ★
        </span>
      );
    });
  };

  const getRatingPercentage = (rating: number): number => {
    if (stats.totalReviews === 0) return 0;
    const count = stats.ratingDistribution[rating] || 0;
    return (count / stats.totalReviews) * 100;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Review Statistics</h2>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.averageRating}>
            <div className={styles.ratingValue}>
              {displayRating}
            </div>
            {hasReviews && stats.averageRating !== null && (
              <div className={styles.starsContainer}>
                {renderStars(averageRating)}
              </div>
            )}
          </div>
          <div className={styles.totalReviews}>
            {hasReviews 
              ? `Based on ${stats.totalReviews} review${stats.totalReviews !== 1 ? 's' : ''}`
              : 'No reviews yet'
            }
          </div>
        </div>
        <div className={styles.distributionCard}>
          <h3 className={styles.distributionTitle}>Rating Distribution</h3>
          <div className={styles.distributionList}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = getRatingPercentage(rating);
              return (
                <div key={rating} className={styles.distributionItem}>
                  <div className={styles.distributionLabel}>
                    <span>{rating} star{rating !== 1 ? 's' : ''}</span>
                    <span className={styles.distributionCount}>
                      {stats.ratingDistribution[rating] || 0}
                    </span>
                  </div>
                  <div className={styles.distributionBar}>
                    <div
                      className={styles.distributionBarFill}
                      style={{ '--bar-width': `${percentage}%` } as React.CSSProperties}
                      role="progressbar"
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


