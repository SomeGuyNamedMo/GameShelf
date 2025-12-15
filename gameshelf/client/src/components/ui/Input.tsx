import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type ChangeEvent,
  useState,
} from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      size = 'md',
      type = 'text',
      clearable = false,
      onClear,
      value,
      onChange,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const hasValue = value !== undefined && value !== '';

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        const event = {
          target: { value: '' },
        } as ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={`
            ${styles.inputWrapper}
            ${styles[size]}
            ${error ? styles.hasError : ''}
            ${leftIcon ? styles.hasLeftIcon : ''}
            ${rightIcon || isPassword || clearable ? styles.hasRightIcon : ''}
          `.trim()}
        >
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            onChange={onChange}
            className={styles.input}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className={styles.rightIcon}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {!isPassword && clearable && hasValue && (
            <button
              type="button"
              className={styles.rightIcon}
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Clear input"
            >
              <X size={16} />
            </button>
          )}
          {!isPassword && !clearable && rightIcon && (
            <span className={styles.rightIcon}>{rightIcon}</span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

