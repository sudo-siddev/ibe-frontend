import { useEffect } from 'react';
import { useRooms } from '../../hooks/useRooms';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setRooms, fetchRoomsWithStats } from '../../store/slices/roomsSlice';
import { RoomsList } from '../../components/RoomsList/RoomsList';
import styles from './LandingPage.module.css';

export const LandingPage = (): JSX.Element => {
  const { rooms, loading: roomsLoading, error: roomsError } = useRooms();
  const dispatch = useAppDispatch();
  const { roomsWithStats, loading: statsLoading, error: statsError } =
    useAppSelector((state) => state.rooms);

  useEffect(() => {
    // Once rooms are loaded, update Redux state and fetch stats for each room
    if (rooms.length > 0) {
      dispatch(setRooms(rooms));
      dispatch(fetchRoomsWithStats());
    }
  }, [rooms, dispatch]);

  const loading = roomsLoading || statsLoading;
  const error = roomsError?.message || statsError || null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Select a Room</h1>
        <p className={styles.subtitle}>
          Choose a room to view reviews and ratings
        </p>
      </div>
      <RoomsList
        rooms={roomsWithStats}
        loading={loading}
        error={error}
      />
    </div>
  );
};

