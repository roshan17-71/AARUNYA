import { Search, X, RotateCcw, Filter, MapPin, Award } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface HospitalFilterSidebarProps {
  cities: string[];
  specialties: string[];
  accreditations: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  selectedAccreditation: string;
  onSelectAccreditation: (accreditation: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onReset: () => void;
  totalCount: number;
}

export const HospitalFilterSidebar = ({
  cities,
  specialties,
  accreditations,
  selectedCity,
  onSelectCity,
  selectedSpecialty,
  onSelectSpecialty,
  selectedAccreditation,
  onSelectAccreditation,
  searchTerm,
  onSearchChange,
  onReset,
  totalCount,
}: HospitalFilterSidebarProps) => {
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCity !== 'All' ||
    selectedSpecialty !== 'All' ||
    selectedAccreditation !== 'All';

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-neutral-surface border border-neutral-border rounded-card p-5 space-y-6 shadow-sm">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-neutral-border pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-bold text-neutral-text text-sm">
            Filter Hospitals
          </h3>
          <span className="text-[11px] font-semibold text-neutral-muted bg-neutral-bg px-2 py-0.5 rounded-full border border-neutral-border">
            {totalCount}
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover font-medium transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-text block">
          Search Hospital or City
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="e.g. Apollo, Delhi, Cardiac..."
            className="w-full pl-8 pr-8 py-2 text-xs rounded-input bg-neutral-bg border border-neutral-border text-neutral-text placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <Search className="w-3.5 h-3.5 text-neutral-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-muted hover:text-neutral-text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-neutral-text">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>City in India</span>
        </div>
        <select
          value={selectedCity}
          onChange={(e) => onSelectCity(e.target.value)}
          className="w-full text-xs py-2 px-2.5 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="All">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Accreditation Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-neutral-text">
          <Award className="w-3.5 h-3.5 text-accent" />
          <span>Accreditation Standards</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectAccreditation('All')}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              selectedAccreditation === 'All'
                ? 'bg-primary text-white'
                : 'bg-neutral-bg text-neutral-muted hover:text-neutral-text border border-neutral-border'
            }`}
          >
            All
          </button>
          {accreditations.map((acc) => (
            <button
              key={acc}
              onClick={() => onSelectAccreditation(acc)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                selectedAccreditation === acc
                  ? 'bg-primary text-white'
                  : 'bg-neutral-bg text-neutral-muted hover:text-neutral-text border border-neutral-border'
              }`}
            >
              {acc}
            </button>
          ))}
        </div>
      </div>

      {/* Specialty Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-text block">
          Clinical Specialty
        </label>
        <select
          value={selectedSpecialty}
          onChange={(e) => onSelectSpecialty(e.target.value)}
          className="w-full text-xs py-2 px-2.5 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="All">All Specialties</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-neutral-border space-y-2">
          <span className="text-[11px] font-semibold text-neutral-muted block">
            Applied Filters:
          </span>
          <div className="flex flex-wrap gap-1">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary-light text-primary font-medium px-2 py-0.5 rounded-full">
                "{searchTerm}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => onSearchChange('')} />
              </span>
            )}
            {selectedCity !== 'All' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary-light text-primary font-medium px-2 py-0.5 rounded-full">
                {selectedCity}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onSelectCity('All')} />
              </span>
            )}
            {selectedAccreditation !== 'All' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary-light text-primary font-medium px-2 py-0.5 rounded-full">
                {selectedAccreditation}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onSelectAccreditation('All')} />
              </span>
            )}
            {selectedSpecialty !== 'All' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary-light text-primary font-medium px-2 py-0.5 rounded-full">
                {selectedSpecialty}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onSelectSpecialty('All')} />
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="w-full text-xs text-neutral-muted hover:text-neutral-text mt-2 justify-center"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </aside>
  );
};

