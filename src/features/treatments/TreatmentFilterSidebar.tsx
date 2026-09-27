import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Filter, X, Search, RotateCcw } from 'lucide-react';

export interface TreatmentFilterSidebarProps {
  specialties: string[];
  categories: string[];
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  onReset: () => void;
  totalCount: number;
}

export const TreatmentFilterSidebar = ({
  specialties,
  categories,
  selectedSpecialty,
  onSelectSpecialty,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onReset,
  totalCount,
}: TreatmentFilterSidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasActiveFilters =
    Boolean(searchTerm) ||
    (selectedSpecialty && selectedSpecialty !== 'All') ||
    (selectedCategory && selectedCategory !== 'All');

  const filterContent = (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="text-xs font-semibold text-neutral-text uppercase tracking-wider mb-2 block">
          Search Procedure
        </label>
        <div className="relative">
          <Input
            placeholder="e.g. Bypass, Knee, Liver..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs"
          />
          <Search className="w-4 h-4 text-neutral-muted absolute left-2.5 top-3 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-3 text-neutral-muted hover:text-neutral-text"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Specialty Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-neutral-text uppercase tracking-wider">
            Clinical Specialty
          </label>
          {selectedSpecialty && selectedSpecialty !== 'All' && (
            <button
              onClick={() => onSelectSpecialty('All')}
              className="text-[11px] text-primary hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectSpecialty('All')}
            className={`w-full text-left px-2.5 py-1.5 rounded-button text-xs transition-colors flex items-center justify-between ${
              !selectedSpecialty || selectedSpecialty === 'All'
                ? 'bg-primary-light font-semibold text-primary'
                : 'text-neutral-muted hover:bg-neutral-bg hover:text-neutral-text'
            }`}
          >
            <span>All Specialties</span>
          </button>
          {specialties.map((s) => {
            const isSelected = selectedSpecialty === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => onSelectSpecialty(s)}
                className={`w-full text-left px-2.5 py-1.5 rounded-button text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-primary-light font-semibold text-primary'
                    : 'text-neutral-muted hover:bg-neutral-bg hover:text-neutral-text'
                }`}
              >
                <span className="truncate mr-2">{s}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="pt-4 border-t border-neutral-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-neutral-text uppercase tracking-wider">
              Procedure Category
            </label>
            {selectedCategory && selectedCategory !== 'All' && (
              <button
                onClick={() => onSelectCategory('All')}
                className="text-[11px] text-primary hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => onSelectCategory('All')}
              className={`w-full text-left px-2.5 py-1.5 rounded-button text-xs transition-colors ${
                !selectedCategory || selectedCategory === 'All'
                  ? 'bg-primary-light font-semibold text-primary'
                  : 'text-neutral-muted hover:bg-neutral-bg hover:text-neutral-text'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => {
              const isSelected = selectedCategory === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onSelectCategory(c)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-button text-xs transition-colors ${
                    isSelected
                      ? 'bg-primary-light font-semibold text-primary'
                      : 'text-neutral-muted hover:bg-neutral-bg hover:text-neutral-text'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset All Filters Button */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-neutral-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="w-full justify-center text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-muted" />
            <span>Reset All Filters</span>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter bar trigger */}
      <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-neutral-border">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            {totalCount} {totalCount === 1 ? 'Procedure' : 'Procedures'}
          </Badge>
          {hasActiveFilters && (
            <span className="text-xs text-primary font-medium">Filters Applied</span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="gap-1.5"
        >
          <Filter className="w-4 h-4 text-primary" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-neutral-text/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-neutral-surface shadow-dropdown p-6 overflow-y-auto z-10 border-l border-neutral-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-border">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-neutral-text text-sm">Filter Treatments</h3>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-neutral-muted hover:text-neutral-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 border-t border-neutral-border">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => setMobileOpen(false)}
              >
                Apply &amp; View ({totalCount})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <Card className="p-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-border">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-neutral-text text-xs uppercase tracking-wider">
                Filters
              </h3>
            </div>
            <span className="text-[11px] text-neutral-muted">
              {totalCount} Available
            </span>
          </div>
          {filterContent}
        </Card>
      </aside>
    </>
  );
};

