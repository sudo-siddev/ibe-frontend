import { RoomCard } from '../RoomCard/RoomCard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import styles from './RoomsList.module.css';

interface RoomsListProps {
  rooms: Array<{
    roomId: number;
    roomNumber: string;
    averageRating: number | null;
    totalReviews: number;
  }>;
  loading: boolean;
  error: string | null;
}

export const RoomsList = ({
  rooms,
  loading,
  error,
}: RoomsListProps): JSX.Element => {
  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>No rooms available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {rooms.map((room) => (
          <RoomCard
            key={room.roomId}
            roomId={room.roomId}
            roomNumber={room.roomNumber}
            averageRating={room.averageRating}
            totalReviews={room.totalReviews}
          />
        ))}
      </div>
    </div>
  );
};


