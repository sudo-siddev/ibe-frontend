import { useState, useEffect } from 'react';
import { reviewApi } from '../api/reviews';
import type { ReviewConfig } from '../types';
import type { ApiError } from '../types';

interface UseReviewConfigResult {
  config: ReviewConfig | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export const useReviewConfig = (hotelId: string): UseReviewConfigResult => {
  const [config, setConfig] = useState<ReviewConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reviewApi.getConfig(hotelId);
      setConfig(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId) {
      fetchConfig();
    }
  }, [hotelId]);

  return {
    config,
    loading,
    error,
    refetch: fetchConfig,
  };
};


