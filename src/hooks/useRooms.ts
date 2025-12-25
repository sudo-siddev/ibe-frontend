import { useState, useEffect } from 'react';
import { getRooms } from '../api/rooms.api';
import type { Room } from '../types/room';
import type { ApiError } from '../types';

interface UseRoomsResult {
  rooms: Room[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching rooms data
 * 
 * Rooms are upstream data owned by the booking engine.
 * This hook provides a clean interface for components to consume room data.
 */
export const useRooms = (): UseRoomsResult => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      const apiError: ApiError = {
        message: 'Failed to fetch rooms data',
        status: 500,
      };
      if (err instanceof Error) {
        apiError.message = err.message;
      }
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
  };
};


