import { forwardRef, useId } from 'react';
import { COUNTRIES } from '../../data/countries';
import { ChevronDown } from 'lucide-react';

export interface PhoneInputProps {
  label?: string;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (number: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label = 'Phone Number',
      countryCode,
      onCountryCodeChange,
      phoneNumber,
      onPhoneNumberChange,
      error,
      helperText,
      required = false,
      disabled = false,
    },
    ref
  ) => {
    const id = useId();

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-neutral-text">
            {label}
            {required && <span className="text-status-error ml-1">*</span>}
          </label>
        )}
        <div className="flex rounded-input shadow-subtle">
          {/* Dial code select */}
          <div className="relative w-32 shrink-0">
            <select
              value={countryCode}
              onChange={(e) => onCountryCodeChange(e.target.value)}
              disabled={disabled}
              className={`w-full h-10 pl-2.5 pr-7 py-2 text-xs bg-neutral-surface border rounded-l-input text-neutral-text appearance-none focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 border-r-0 ${
                error
                  ? 'border-status-error focus:ring-status-error'
                  : 'border-neutral-border focus:ring-primary'
              }`}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.dialCode}>
                  {c.dialCode} ({c.code})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-neutral-muted">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Phone number input */}
          <input
            ref={ref}
            id={id}
            type="tel"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            disabled={disabled}
            placeholder="9876543210"
            className={`w-full h-10 px-3 py-2 text-sm bg-neutral-surface border rounded-r-input transition-colors text-neutral-text placeholder:text-neutral-subtle focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 ${
              error
                ? 'border-status-error focus:ring-status-error'
                : 'border-neutral-border focus:ring-primary'
            }`}
          />
        </div>
        {error && <p className="text-xs text-status-error mt-0.5">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-neutral-muted mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

