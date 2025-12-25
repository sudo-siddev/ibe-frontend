import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setRooms } from '../../store/slices/roomsSlice';
import { getRooms } from '../../api/rooms.api';
import { useReviewConfig } from '../../hooks/useReviewConfig';
import { useReviews } from '../../hooks/useReviews';
import { useReviewStats } from '../../hooks/useReviewStats';
import { ReviewStats } from '../../components/ReviewStats/ReviewStats';
import { ReviewList } from '../../components/ReviewList/ReviewList';
import { WriteReview } from '../../components/WriteReview/WriteReview';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../../components/SuccessMessage/SuccessMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './ReviewsPage.module.css';

export const ReviewsPage = (): JSX.Element => {
  const { roomId } = useParams<{ roomId: string }>();
  const rooms = useAppSelector((state) => state.rooms.rooms);
  const dispatch = useAppDispatch();
  
  if (!roomId) {
    return (
      <div className={styles.container}>
        <ErrorMessage message="Room ID is required" />
        <Link to="/" className={styles.backLink}>
          ← Back to Rooms
        </Link>
      </div>
    );
  }

  useEffect(() => {
    if (rooms.length === 0) {
      getRooms().then((roomsData) => {
        dispatch(setRooms(roomsData));
      });
    }
  }, [rooms.length, dispatch]);

  const room = useMemo(() => {
    const roomIdNum = parseInt(roomId, 10);
    return rooms.find((r) => r.roomId === roomIdNum);
  }, [rooms, roomId]);

  const hotelId = room?.hotelId?.toString() ?? roomId;
  
  const { config, loading: configLoading, error: configError } =
    useReviewConfig(hotelId);
  const { refetch: refetchReviews, setPage, page } = useReviews(roomId);
  const { refetch: refetchStats } = useReviewStats(roomId);

  const [showWriteForm, setShowWriteForm] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const handleReviewSuccess = async (): Promise<void> => {
    setShowWriteForm(false);
    setPage(0);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await Promise.all([refetchReviews(), refetchStats()]);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  if (configLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (configError) {
    return (
      <div className={styles.container}>
        <ErrorMessage message={configError.message} />
      </div>
    );
  }

  if (!config) {
    return (
      <div className={styles.container}>
        <ErrorMessage message="Unable to load review configuration" />
      </div>
    );
  }

  const isReviewEnabled = config.enabled;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          ← Back to Rooms
        </Link>
        <h1 className={styles.pageTitle}>Room Reviews</h1>
        {!isReviewEnabled && (
          <div className={styles.disabledMessage} role="alert">
            <p className={styles.disabledMessageText}>
              <strong>Reviews are currently disabled:</strong> {config.reason}
            </p>
          </div>
        )}
      </div>

      <ReviewStats roomId={roomId} />

      {isReviewEnabled && (
        <>
          {showSuccessMessage && (
            <div className={styles.notificationContainer}>
              <SuccessMessage
                message="Review submitted successfully! Your review has been added."
                onDismiss={() => setShowSuccessMessage(false)}
              />
            </div>
          )}
          {!showWriteForm ? (
            <div className={styles.writeReviewToggle}>
              <button
                className={styles.writeReviewButton}
                onClick={() => setShowWriteForm(true)}
                type="button"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <WriteReview roomId={roomId} onSuccess={handleReviewSuccess} />
          )}
        </>
      )}

      <ReviewList roomId={roomId} />
    </div>
  );
};

