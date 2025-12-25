import type { ApiError } from '../types';
import type { AxiosError } from 'axios';

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  CLIENT_ERROR = 'CLIENT_ERROR',
  EMPTY_STATE = 'EMPTY_STATE',
}

export const classifyError = (error: AxiosError): ErrorType => {
  if (!error.response) {
    return ErrorType.NETWORK_ERROR;
  }

  const status = error.response.status;

  if (status >= 500) {
    return ErrorType.SERVER_ERROR;
  }

  if (status === 404) {
    return ErrorType.RESOURCE_NOT_FOUND;
  }

  if (status >= 400) {
    return ErrorType.CLIENT_ERROR;
  }

  return ErrorType.CLIENT_ERROR;
};

export const isNetworkOrServerError = (error: ApiError | null): boolean => {
  if (!error) return false;
  
  if (error.status === 0 || !error.status) {
    return true;
  }

  if (error.status >= 500) {
    return true;
  }

  return false;
};

export const isEmptyState = (
  totalReviews: number,
  averageRating: number | null
): boolean => {
  return totalReviews === 0 && averageRating === null;
};

