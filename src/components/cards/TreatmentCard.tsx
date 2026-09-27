import { Link } from 'react-router-dom';
import { Treatment } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Clock, ArrowRight } from 'lucide-react';

export interface TreatmentCardProps {
  treatment: Treatment;
}

export const TreatmentCard = ({ treatment }: TreatmentCardProps) => {
  return (
    <Card hoverEffect className="flex flex-col justify-between h-full bg-neutral-surface border-neutral-border">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="primary" size="sm">
            {treatment.specialty}
          </Badge>
          <span className="text-[11px] font-medium text-neutral-muted truncate max-w-[140px]">
            {treatment.category}
          </span>
        </div>

        <CardTitle className="text-base sm:text-lg line-clamp-2 leading-snug">
          {treatment.name}
        </CardTitle>

        <CardDescription className="line-clamp-3 mt-2 text-xs sm:text-sm text-neutral-muted leading-relaxed">
          {treatment.overview || treatment.description || 'Advanced surgical and therapeutic procedure delivered under accredited clinical guidelines.'}
        </CardDescription>
      </CardHeader>

      <CardFooter className="pt-3 border-t border-neutral-border/70 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-neutral-muted">
          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="line-clamp-1">{treatment.estimated_duration || 'Duration varies'}</span>
        </div>

        <Link to={`/treatments/${treatment.slug}`}>
          <Button variant="outline" size="sm" className="group">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
