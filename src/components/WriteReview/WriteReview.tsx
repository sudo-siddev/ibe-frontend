import { useState, FormEvent } from 'react';
import { reviewApi } from '../../api/reviews';
import { validateReviewForm } from '../../utils/validation';
import { VALIDATION } from '../../constants';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import type { ApiError } from '../../types';
import styles from './WriteReview.module.css';

interface WriteReviewProps {
  roomId: string;
  onSuccess: () => void;
}

export const WriteReview = ({
  roomId,
  onSuccess,
}: WriteReviewProps): JSX.Element => {
  const [formData, setFormData] = useState({
    rating: 0,
    bookingId: '',
    comment: '',
    reviewerName: '',
    reviewerEmail: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const handleRatingClick = (rating: number): void => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.rating;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setApiError(null);

    // Client-side validation
    const validation = validateReviewForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await reviewApi.createReview({
        roomId: Number(roomId),
        bookingId: Number(formData.bookingId),
        rating: Number(formData.rating),
        comment: formData.comment.trim(),
        reviewerName: formData.reviewerName.trim(),
        reviewerEmail: formData.reviewerEmail.trim(),
      });
      // Reset form on success
      setFormData({
        rating: 0,
        bookingId: '',
        comment: '',
        reviewerName: '',
        reviewerEmail: '',
      });
      setErrors({});
      setApiError(null);
      onSuccess();
    } catch (err) {
      const error = err as ApiError;
      
      // Handle different error statuses
      if (error.status === 400 && error.errors) {
        // Backend validation errors - show field-level errors
        const fieldErrors: Record<string, string> = {};
        Object.entries(error.errors).forEach(([field, messages]) => {
          // Handle both array and string error formats
          if (Array.isArray(messages)) {
            fieldErrors[field] = messages[0] || 'Invalid value';
          } else if (typeof messages === 'string') {
            fieldErrors[field] = messages;
          } else {
            fieldErrors[field] = 'Invalid value';
          }
        });
        setErrors(fieldErrors);
        setApiError(null);
      } else if (error.status === 409) {
        // Duplicate review
        setApiError(
          error.message || 'You have already submitted a review for this booking.'
        );
        setErrors({});
      } else if (error.status === 404) {
        // Booking or room not found
        setApiError(
          error.message || 'Booking or room not found. Please check your Booking ID.'
        );
        setErrors({});
      } else if (error.status === 403) {
        // Feature disabled
        setApiError(
          error.message || 'Review submission is currently disabled.'
        );
        setErrors({});
      } else if (error.status === 401) {
        // Unauthorized
        setApiError(
          error.message || 'Unauthorized. Please check your credentials.'
        );
        setErrors({});
      } else {
        // Generic error
        setApiError(error.message || 'Failed to submit review. Please try again.');
        setErrors({});
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, index) => {
      const rating = index + 1;
      const isSelected = rating <= formData.rating;
      return (
        <button
          key={rating}
          type="button"
          className={`${styles.starButton} ${
            isSelected ? styles.starSelected : styles.starUnselected
          }`}
          onClick={() => handleRatingClick(rating)}
          aria-label={`Rate ${rating} out of 5`}
        >
          ★
        </button>
      );
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Write a Review</h2>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {apiError && (
          <div className={styles.errorContainer}>
            <ErrorMessage message={apiError} />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="rating" className={styles.label}>
            Rating <span className={styles.required}>*</span>
          </label>
          <div className={styles.ratingContainer}>
            {renderStars()}
            {formData.rating > 0 && (
              <span className={styles.ratingText}>
                {formData.rating} out of 5
              </span>
            )}
          </div>
          {errors.rating && (
            <span className={styles.fieldError} role="alert">
              {errors.rating}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reviewerName" className={styles.label}>
            Guest Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="reviewerName"
            name="reviewerName"
            value={formData.reviewerName}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.reviewerName ? styles.inputError : ''}`}
            aria-invalid={!!errors.reviewerName}
            aria-describedby={errors.reviewerName ? 'reviewerName-error' : undefined}
          />
          {errors.reviewerName && (
            <span
              id="reviewerName-error"
              className={styles.fieldError}
              role="alert"
            >
              {errors.reviewerName}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reviewerEmail" className={styles.label}>
            Guest Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="reviewerEmail"
            name="reviewerEmail"
            value={formData.reviewerEmail}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.reviewerEmail ? styles.inputError : ''}`}
            aria-invalid={!!errors.reviewerEmail}
            aria-describedby={errors.reviewerEmail ? 'reviewerEmail-error' : undefined}
          />
          {errors.reviewerEmail && (
            <span
              id="reviewerEmail-error"
              className={styles.fieldError}
              role="alert"
            >
              {errors.reviewerEmail}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bookingId" className={styles.label}>
            Booking ID <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="bookingId"
            name="bookingId"
            value={formData.bookingId}
            onChange={handleInputChange}
            min="1"
            step="1"
            className={`${styles.input} ${errors.bookingId ? styles.inputError : ''}`}
            aria-invalid={!!errors.bookingId}
            aria-describedby={errors.bookingId ? 'bookingId-error' : undefined}
            placeholder="Enter your booking ID"
          />
          {errors.bookingId && (
            <span
              id="bookingId-error"
              className={styles.fieldError}
              role="alert"
            >
              {errors.bookingId}
            </span>
          )}
          <p className={styles.helpText}>
            Enter the booking ID from your confirmation email or booking confirmation page.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="comment" className={styles.label}>
            Review Comment <span className={styles.required}>*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows={6}
            maxLength={VALIDATION.COMMENT_MAX_LENGTH}
            className={`${styles.textarea} ${errors.comment ? styles.inputError : ''}`}
            aria-invalid={!!errors.comment}
            aria-describedby={errors.comment ? 'comment-error' : undefined}
          />
          <div className={styles.charCount}>
            {formData.comment.length} / {VALIDATION.COMMENT_MAX_LENGTH} characters
          </div>
          {errors.comment && (
            <span id="comment-error" className={styles.fieldError} role="alert">
              {errors.comment}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};


