import { apiClient } from './client';
import { API_ENDPOINTS, PAGINATION } from '../constants';
import type {
  ReviewConfig,
  Review,
  ReviewStats,
  PaginatedResponse,
  CreateReviewRequest,
  ReviewQueryParams,
} from '../types';

export const reviewApi = {
  getConfig: async (hotelId: string): Promise<ReviewConfig> => {
    const response = await apiClient.get<ReviewConfig>(
      `${API_ENDPOINTS.CONFIG}?hotelId=${hotelId}`
    );
    return response.data;
  },

  getReviewsByRoom: async (
    roomId: string,
    params?: ReviewQueryParams
  ): Promise<PaginatedResponse<Review>> => {
    const queryParams: Record<string, string | number> = {
      page: params?.page ?? PAGINATION.DEFAULT_PAGE,
      size: params?.size ?? PAGINATION.DEFAULT_SIZE,
      sortBy: params?.sortBy ?? PAGINATION.DEFAULT_SORT,
    };

    const response = await apiClient.get<PaginatedResponse<Review>>(
      `${API_ENDPOINTS.REVIEWS_BY_ROOM}/${roomId}`,
      { params: queryParams }
    );
    return response.data;
  },

  getReviewStats: async (roomId: string): Promise<ReviewStats> => {
    const response = await apiClient.get<ReviewStats>(
      `${API_ENDPOINTS.REVIEW_STATS}/${roomId}`
    );
    return response.data;
  },

  createReview: async (review: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post<Review>(API_ENDPOINTS.REVIEWS, review);
    return response.data;
  },
};


