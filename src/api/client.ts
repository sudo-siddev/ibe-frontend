import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getApiBaseUrl, getApiUsername, getApiPassword } from '../utils/config';
import { classifyError, ErrorType, isNetworkOrServerError } from '../utils/errorClassification';
import { ApiError } from '../types';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const username = getApiUsername();
      const password = getApiPassword();
      const credentials = btoa(`${username}:${password}`);
      config.headers.Authorization = `Basic ${credentials}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const errorType = classifyError(error);
      
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        status: error.response?.status ?? 0,
        errorType: errorType,
        isNetworkError: errorType === ErrorType.NETWORK_ERROR || errorType === ErrorType.SERVER_ERROR,
      };

      if (error.response) {
        const data = error.response.data as
          | { message?: string; errors?: Record<string, string[]> }
          | undefined;

        if (error.response.status === 400) {
          apiError.message = data?.message || 'Validation error. Please check your input.';
          if (data?.errors) {
            apiError.errors = data.errors;
          }
        } else if (error.response.status === 401) {
          apiError.message = 'Unauthorized. Please check your credentials.';
        } else if (error.response.status === 403) {
          apiError.message = data?.message || 'Access forbidden. This feature may be disabled.';
        } else if (error.response.status === 404) {
          apiError.message = data?.message || 'Resource not found.';
        } else if (error.response.status === 409) {
          apiError.message = data?.message || 'Duplicate review. You have already submitted a review for this booking.';
        } else if (error.response.status >= 500) {
          apiError.message = 'Service temporarily unavailable. Please try again later.';
        } else if (data?.message) {
          apiError.message = data.message;
        } else {
          apiError.message = `Request failed with status ${error.response.status}`;
        }
      } else if (error.request) {
        apiError.message = "You're offline or our service is temporarily unavailable. Please check your connection and try again.";
        apiError.status = 0;
      }

      return Promise.reject(apiError);
    }
  );

  return instance;
};

export const apiClient = createAxiosInstance();


