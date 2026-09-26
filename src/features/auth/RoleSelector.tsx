import { Link } from 'react-router-dom';
import { UserRole } from '../../types';
import { User, Stethoscope, Building2 } from 'lucide-react';

export interface RoleSelectorProps {
  activeRole?: UserRole;
}

export const RoleSelector = ({ activeRole }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'patient' as UserRole,
      title: 'Patient',
      description: 'Find treatments, get quotes & book doctors',
      icon: User,
      href: '/signup/patient',
    },
    {
      id: 'doctor' as UserRole,
      title: 'Doctor',
      description: 'Manage clinical profile, rates & consultations',
      icon: Stethoscope,
      href: '/signup/doctor',
    },
    {
      id: 'hospital' as UserRole,
      title: 'Hospital',
      description: 'List medical facilities, packages & services',
      icon: Building2,
      href: '/signup/hospital',
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = activeRole === r.id;

          return (
            <Link
              key={r.id}
              to={r.href}
              className={`p-4 rounded-card border text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                  : 'border-neutral-border bg-neutral-surface hover:border-primary/40 hover:bg-neutral-bg'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-md flex items-center justify-center mb-2.5 ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-primary-light text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-neutral-text">{r.title}</h4>
              <p className="text-[11px] text-neutral-muted mt-1 leading-snug">
                {r.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

