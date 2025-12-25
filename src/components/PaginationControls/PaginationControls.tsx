import styles from './PaginationControls.module.css';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  first,
  last,
  onPageChange,
  loading = false,
}: PaginationControlsProps): JSX.Element => {
  const handlePrevious = (): void => {
    if (!first && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (): void => {
    if (!last && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={handlePrevious}
        disabled={first || loading}
        type="button"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className={styles.pageInfo}>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        className={styles.button}
        onClick={handleNext}
        disabled={last || loading}
        type="button"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

