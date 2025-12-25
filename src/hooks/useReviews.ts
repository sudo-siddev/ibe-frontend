import { useState, useEffect, useRef } from 'react';
import { reviewApi } from '../api/reviews';
import { PAGINATION } from '../constants';
import { isNetworkOrServerError } from '../utils/errorClassification';
import type { Review, PaginatedResponse, ReviewQueryParams } from '../types';
import type { ApiError } from '../types';

interface UseReviewsResult {
  reviews: Review[];
  pagination: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  } | null;
  loading: boolean;
  error: ApiError | null;
  sortBy: string;
  page: number;
  setSortBy: (sortBy: string) => void;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export const useReviews = (
  roomId: string,
  initialParams?: ReviewQueryParams
): UseReviewsResult => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<UseReviewsResult['pagination']>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    initialParams?.page ?? PAGINATION.DEFAULT_PAGE
  );
  const [sortBy, setSortByState] = useState<string>(
    initialParams?.sortBy ?? PAGINATION.DEFAULT_SORT
  );

  const pageSize = PAGINATION.DEFAULT_SIZE;

  const currentPageRef = useRef(currentPage);
  const sortByRef = useRef(sortBy);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    sortByRef.current = sortBy;
  }, [sortBy]);

  useEffect(() => {
    if (roomId) {
      setCurrentPage(PAGINATION.DEFAULT_PAGE);
      setSortByState(PAGINATION.DEFAULT_SORT);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: PaginatedResponse<Review> = await reviewApi.getReviewsByRoom(
          roomId,
          {
            page: currentPage,
            size: pageSize,
            sortBy: sortBy,
          }
        );
        
        setReviews(data.content);
        setPagination({
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          currentPage: data.number,
          size: data.size,
          first: data.first,
          last: data.last,
          empty: data.empty ?? false,
        });
      } catch (err) {
        const apiError = err as ApiError;
        
        if (apiError.status === 404) {
          setReviews([]);
          setPagination({
            totalElements: 0,
            totalPages: 0,
            currentPage: 0,
            size: pageSize,
            first: true,
            last: true,
            empty: true,
          });
          setError(null);
        } else if (isNetworkOrServerError(apiError)) {
          setError(apiError);
        } else {
          setError(apiError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId, currentPage, sortBy, pageSize]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageToUse = currentPageRef.current;
      const sortToUse = sortByRef.current;
      
      const data: PaginatedResponse<Review> = await reviewApi.getReviewsByRoom(
        roomId,
        {
          page: pageToUse,
          size: pageSize,
          sortBy: sortToUse,
        }
      );
      setReviews(data.content);
      setPagination({
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        currentPage: data.number,
        size: data.size,
        first: data.first,
        last: data.last,
        empty: data.empty ?? false,
      });
    } catch (err) {
      const apiError = err as ApiError;
      
      if (apiError.status === 404) {
        setReviews([]);
        setPagination({
          totalElements: 0,
          totalPages: 0,
          currentPage: 0,
          size: pageSize,
          first: true,
          last: true,
          empty: true,
        });
        setError(null);
      } else if (isNetworkOrServerError(apiError)) {
        setError(apiError);
      } else {
        setError(apiError);
      }
    } finally {
      setLoading(false);
    }
  };

  const setSortBy = (newSortBy: string) => {
    setSortByState(newSortBy);
    setCurrentPage(PAGINATION.DEFAULT_PAGE);
  };

  const setPage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return {
    reviews,
    pagination,
    loading,
    error,
    sortBy,
    page: currentPage,
    setSortBy,
    setPage,
    refetch,
  };
};

