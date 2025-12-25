import type { Room } from '../types/room';

export const getRooms = async (): Promise<Room[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockRooms: Room[] = [
    { roomId: 1, roomNumber: '101', hotelId: 1 },
    { roomId: 2, roomNumber: '102', hotelId: 1 },
    { roomId: 3, roomNumber: '103', hotelId: 2 },
    { roomId: 4, roomNumber: '104', hotelId: 1 },
    { roomId: 5, roomNumber: '105', hotelId: 1 },
    { roomId: 6, roomNumber: '201', hotelId: 1 },
    { roomId: 7, roomNumber: '202', hotelId: 1 },
    { roomId: 8, roomNumber: '203', hotelId: 1 },
    { roomId: 9, roomNumber: '301', hotelId: 1 },
    { roomId: 10, roomNumber: '302', hotelId: 1 },
  ];

  return mockRooms;
};


