import { useState, useEffect, useCallback } from 'react';
import { reviewApi } from '../api/reviews';
import { isEmptyState, isNetworkOrServerError } from '../utils/errorClassification';
import type { ReviewStats } from '../types';
import type { ApiError } from '../types';

interface UseReviewStatsResult {
  stats: ReviewStats | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export const useReviewStats = (roomId: string): UseReviewStatsResult => {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewApi.getReviewStats(roomId);
      
      if (isEmptyState(data.totalReviews, data.averageRating)) {
        setStats(data);
        setError(null);
      } else {
        setStats(data);
        setError(null);
      }
    } catch (err) {
      const apiError = err as ApiError;
      
      if (apiError.status === 404) {
        setStats({
          averageRating: null,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        });
        setError(null);
      } else if (isNetworkOrServerError(apiError)) {
        setError(apiError);
        setStats(null);
      } else {
        setError(apiError);
        setStats(null);
      }
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      fetchStats();
    }
  }, [roomId, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

