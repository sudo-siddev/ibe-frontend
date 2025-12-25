import { useReviews } from '../../hooks/useReviews';
import { isNetworkOrServerError } from '../../utils/errorClassification';
import { ReviewItem } from '../ReviewItem/ReviewItem';
import { SortDropdown } from '../SortDropdown/SortDropdown';
import { PaginationControls } from '../PaginationControls/PaginationControls';
import { NetworkError } from '../NetworkError/NetworkError';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import styles from './ReviewList.module.css';

interface ReviewListProps {
  roomId: string;
}

export const ReviewList = ({ roomId }: ReviewListProps): JSX.Element => {
  const {
    reviews,
    pagination,
    loading,
    error,
    sortBy,
    page,
    setSortBy,
    setPage,
    refetch,
  } = useReviews(roomId);

  if (loading && reviews.length === 0) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  // Show network/server errors with retry option
  if (error && isNetworkOrServerError(error)) {
    return (
      <div className={styles.container}>
        <NetworkError onRetry={refetch} />
      </div>
    );
  }

  // Show other errors (4xx except 404)
  if (error) {
    return (
      <div className={styles.container}>
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  // Show empty state only when there's no error (valid empty data)
  if (pagination?.empty || reviews.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>No reviews yet. Be the first to review this room!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Reviews</h2>
        <SortDropdown
          value={sortBy}
          onChange={setSortBy}
          disabled={loading}
        />
      </div>
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <ReviewItem key={review.reviewId} review={review} />
        ))}
      </div>
      {pagination && (
        <>
          <div className={styles.paginationInfo}>
            Showing {reviews.length} of {pagination.totalElements} reviews
          </div>
          <PaginationControls
            currentPage={page}
            totalPages={pagination.totalPages}
            first={pagination.first}
            last={pagination.last}
            onPageChange={setPage}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};


