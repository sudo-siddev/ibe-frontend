import { VALIDATION } from '../constants';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateReviewForm = (data: {
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
  bookingId: number | string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Rating validation
  if (
    !data.rating ||
    data.rating < VALIDATION.RATING_MIN ||
    data.rating > VALIDATION.RATING_MAX
  ) {
    errors.rating = `Rating must be between ${VALIDATION.RATING_MIN} and ${VALIDATION.RATING_MAX}`;
  }

  // Booking ID validation
  const bookingIdNum = Number(data.bookingId);
  if (!data.bookingId || data.bookingId.toString().trim().length === 0) {
    errors.bookingId = 'Booking ID is required';
  } else if (isNaN(bookingIdNum) || bookingIdNum <= 0) {
    errors.bookingId = 'Booking ID must be a positive number';
  }

  // Comment validation
  if (!data.comment || data.comment.trim().length === 0) {
    errors.comment = 'Comment is required';
  } else if (data.comment.length > VALIDATION.COMMENT_MAX_LENGTH) {
    errors.comment = `Comment must not exceed ${VALIDATION.COMMENT_MAX_LENGTH} characters`;
  }

  // Reviewer name validation
  if (!data.reviewerName || data.reviewerName.trim().length === 0) {
    errors.reviewerName = 'Name is required';
  }

  // Email validation
  if (!data.reviewerEmail || data.reviewerEmail.trim().length === 0) {
    errors.reviewerEmail = 'Email is required';
  } else if (!VALIDATION.EMAIL_REGEX.test(data.reviewerEmail)) {
    errors.reviewerEmail = 'Please enter a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


