export const API_ENDPOINTS = {
  CONFIG: '/api/config/reviews',
  REVIEWS: '/api/reviews',
  REVIEWS_BY_ROOM: '/api/reviews/room',
  REVIEW_STATS: '/api/reviews/stats',
} as const;

// Page size for reviews - can be overridden via environment variable
export const REVIEWS_PAGE_SIZE = Number(
  import.meta.env.VITE_REVIEWS_PAGE_SIZE ?? 5
);

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: REVIEWS_PAGE_SIZE,
  DEFAULT_SORT: 'createdAt,desc',
} as const;

export const SORT_OPTIONS = [
  { label: 'Most Recent', value: 'createdAt,desc' },
  { label: 'Oldest First', value: 'createdAt,asc' },
  { label: 'Highest Rated', value: 'rating,desc' },
  { label: 'Lowest Rated', value: 'rating,asc' },
] as const;

export const VALIDATION = {
  RATING_MIN: 1,
  RATING_MAX: 5,
  COMMENT_MAX_LENGTH: 1000,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

