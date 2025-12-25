import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reviewApi } from '../../api/reviews';
import { getRooms } from '../../api/rooms.api';
import type { Room } from '../../types/room';
import type { RoomWithStats, ReviewStats } from '../../types';

interface RoomsState {
  rooms: Room[];
  roomsWithStats: RoomWithStats[];
  loading: boolean;
  error: string | null;
  selectedRoomId: number | null;
}

const initialState: RoomsState = {
  rooms: [],
  roomsWithStats: [],
  loading: false,
  error: null,
  selectedRoomId: null,
};

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  return await getRooms();
});

export const fetchRoomsWithStats = createAsyncThunk(
  'rooms/fetchRoomsWithStats',
  async (_, { getState }) => {
    const state = getState() as { rooms: RoomsState };
    const rooms = state.rooms.rooms;

    const roomsWithStatsPromises = rooms.map(async (room) => {
      try {
        const stats: ReviewStats = await reviewApi.getReviewStats(
          room.roomId.toString()
        );
        return {
          ...room,
          averageRating: stats.averageRating,
          totalReviews: stats.totalReviews,
        };
      } catch (err) {
        return {
          ...room,
          averageRating: null,
          totalReviews: 0,
        };
      }
    });

    const roomsWithStats = await Promise.all(roomsWithStatsPromises);
    return roomsWithStats;
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setSelectedRoom: (state, action: PayloadAction<number | null>) => {
      state.selectedRoomId = action.payload;
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rooms';
      })
      .addCase(fetchRoomsWithStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomsWithStats.fulfilled, (state, action) => {
        state.loading = false;
        state.roomsWithStats = action.payload;
      })
      .addCase(fetchRoomsWithStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch room statistics';
      });
  },
});

export const { setSelectedRoom, setRooms, clearError } = roomsSlice.actions;
export default roomsSlice.reducer;

