import { SORT_OPTIONS } from '../../constants';
import styles from './SortDropdown.module.css';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SortDropdown = ({
  value,
  onChange,
  disabled = false,
}: SortDropdownProps): JSX.Element => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.container}>
      <label htmlFor="sort-select" className={styles.label}>
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={styles.select}
        aria-label="Sort reviews"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

