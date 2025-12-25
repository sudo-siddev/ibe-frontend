export interface ReviewConfig {
  enabled: boolean;
  scope: string;
  reason: string;
}

export interface Review {
  reviewId: number;
  roomId: number;
  bookingId: number;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
  createdAt: string;
}

export interface ReviewStats {
  averageRating: number | null;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export interface CreateReviewRequest {
  roomId: number;
  bookingId: number;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  errorType?: string; // ErrorType enum value for classification
  isNetworkError?: boolean; // True if this is a network/server error
}

export interface ReviewQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
}

export interface RoomWithStats {
  roomId: number;
  roomNumber: string;
  hotelId: number;
  averageRating: number | null;
  totalReviews: number;
}

