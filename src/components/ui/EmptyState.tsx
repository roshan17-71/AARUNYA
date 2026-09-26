import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionComponent?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionComponent,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-border rounded-card bg-neutral-surface/50 max-w-md mx-auto my-6">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary mb-4">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-neutral-text mb-1">{title}</h3>
      <p className="text-sm text-neutral-muted mb-4 max-w-xs">{description}</p>
      {actionComponent ? (
        actionComponent
      ) : actionLabel && onAction ? (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

