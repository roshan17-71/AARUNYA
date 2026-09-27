import { ReactNode } from 'react';
import { Badge } from './Badge';

export interface SectionHeadingProps {
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
}

export const SectionHeading = ({
  badge,
  badgeVariant = 'primary',
  title,
  subtitle,
  align = 'center',
  action,
  className = '',
}: SectionHeadingProps) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-10 sm:mb-12 ${
        isCenter ? 'text-center mx-auto max-w-3xl' : 'flex flex-col md:flex-row md:items-end justify-between gap-4'
      } ${className}`}
    >
      <div>
        {badge && (
          <div className={`mb-3 ${isCenter ? 'flex justify-center' : ''}`}>
            <Badge variant={badgeVariant}>{badge}</Badge>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-neutral-text tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-neutral-muted leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && !isCenter && <div className="shrink-0">{action}</div>}
    </div>
  );
};

