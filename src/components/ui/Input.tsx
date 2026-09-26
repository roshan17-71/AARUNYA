import { InputHTMLAttributes, forwardRef, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-neutral-text"
          >
            {label}
            {props.required && <span className="text-status-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full h-10 px-3 py-2 text-sm bg-neutral-surface border rounded-input transition-colors text-neutral-text placeholder:text-neutral-subtle focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
            error
              ? 'border-status-error focus:ring-status-error focus:border-status-error'
              : 'border-neutral-border focus:ring-primary focus:border-primary'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-status-error mt-0.5">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-neutral-muted mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

