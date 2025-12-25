import { format } from 'date-fns';
import styles from './ReviewItem.module.css';

interface ReviewItemProps {
  review: {
    rating: number;
    comment: string;
    reviewerName: string;
    createdAt: string;
  };
}

export const ReviewItem = ({ review }: ReviewItemProps): JSX.Element => {
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${styles.star} ${
          index < rating ? styles.starFilled : styles.starEmpty
        }`}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  };

  return (
    <article className={styles.reviewItem}>
      <div className={styles.header}>
        <div className={styles.reviewerInfo}>
          <h3 className={styles.reviewerName}>{review.reviewerName}</h3>
          <time className={styles.date} dateTime={review.createdAt}>
            {formatDate(review.createdAt)}
          </time>
        </div>
        <div className={styles.rating} aria-label={`Rating: ${review.rating} out of 5`}>
          {renderStars(review.rating)}
          <span className={styles.ratingValue}>({review.rating})</span>
        </div>
      </div>
      <p className={styles.comment}>{review.comment}</p>
    </article>
  );
};


