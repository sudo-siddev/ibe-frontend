import { Link } from 'react-router-dom';
import styles from './RoomCard.module.css';

interface RoomCardProps {
  roomId: number;
  roomNumber: string;
  averageRating: number | null;
  totalReviews: number;
}

export const RoomCard = ({
  roomId,
  roomNumber,
  averageRating,
  totalReviews,
}: RoomCardProps): JSX.Element => {
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

  return (
    <Link to={`/rooms/${roomId}`} className={styles.card}>
      <div className={styles.content}>
        <div className={styles.roomInfo}>
          <h3 className={styles.roomNumber}>Room {roomNumber}</h3>
          {totalReviews > 0 && averageRating !== null ? (
            <div className={styles.ratingInfo}>
              <div className={styles.starsContainer}>
                {renderStars(averageRating)}
              </div>
              <div className={styles.ratingText}>
                <span className={styles.ratingValue}>
                  {averageRating.toFixed(1)}
                </span>
                <span className={styles.reviewsCount}>
                  ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.noReviews}>No reviews yet</div>
          )}
        </div>
        <div className={styles.arrow}>→</div>
      </div>
    </Link>
  );
};


