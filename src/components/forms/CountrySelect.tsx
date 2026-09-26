import { forwardRef } from 'react';
import { Select, SelectProps } from '../ui/Select';
import { COUNTRIES } from '../../data/countries';

export interface CountrySelectProps extends Omit<SelectProps, 'options'> {
  value?: string;
}

export const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(
  ({ label = 'Country', ...props }, ref) => {
    const countryOptions = [
      { value: '', label: 'Select country...' },
      ...COUNTRIES.map((c) => ({
        value: c.name,
        label: `${c.name} (${c.code})`,
      })),
    ];

    return (
      <Select
        ref={ref}
        label={label}
        options={countryOptions}
        {...props}
      />
    );
  }
);

CountrySelect.displayName = 'CountrySelect';

