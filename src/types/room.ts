/**
 * Room interface
 * 
 * Represents room metadata owned by the booking engine.
 * This is upstream data that the Review & Rating System consumes.
 */
export interface Room {
  roomId: number;
  roomNumber: string;
  hotelId: number;
}


