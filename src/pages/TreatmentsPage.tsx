import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Treatment } from '../types';
import { treatmentsService } from '../services/treatments.service';
import { Container } from '../components/layout/Container';
import { TreatmentCard } from '../components/cards/TreatmentCard';
import { TreatmentFilterSidebar } from '../features/treatments/TreatmentFilterSidebar';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Stethoscope, Search } from 'lucide-react';

export const TreatmentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Read URL query params
  const initialSearch = searchParams.get('q') || '';
  const initialSpecialty = searchParams.get('specialty') || 'All';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sync state with URL params
  const updateUrlParams = (search: string, specialty: string, category: string) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (specialty && specialty !== 'All') params.set('specialty', specialty);
    if (category && category !== 'All') params.set('category', category);
    setSearchParams(params, { replace: true });
  };

  // Fetch filter taxonomy on mount
  useEffect(() => {
    const loadTaxonomy = async () => {
      const [allSpecialties, allCategories] = await Promise.all([
        treatmentsService.getDistinctSpecialties(),
        treatmentsService.getDistinctCategories(),
      ]);
      setSpecialties(allSpecialties);
      setCategories(allCategories);
    };
    loadTaxonomy();
  }, []);

  // Fetch treatments when filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    treatmentsService
      .getTreatments({
        search: searchTerm,
        specialty: selectedSpecialty,
        category: selectedCategory,
      })
      .then((data) => {
        if (!isMounted) return;
        setTreatments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[TreatmentsPage] Error fetching treatments:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedSpecialty, selectedCategory]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    updateUrlParams(term, selectedSpecialty, selectedCategory);
  };

  const handleSelectSpecialty = (spec: string) => {
    setSelectedSpecialty(spec);
    updateUrlParams(searchTerm, spec, selectedCategory);
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    updateUrlParams(searchTerm, selectedSpecialty, cat);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('All');
    setSelectedCategory('All');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="py-10 sm:py-16 bg-neutral-bg min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center sm:text-left border-b border-neutral-border pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="primary" size="md">
              <Stethoscope className="w-3.5 h-3.5 mr-1" />
              Verified Surgical &amp; Medical Procedures
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-text">
            Explore Medical Treatments in India
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-muted max-w-3xl leading-relaxed">
            Discover accredited medical procedures across cardiac sciences, robotic oncology, joint replacement, organ transplantation, and neurosurgery with transparent cost overviews.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Filter Sidebar */}
          <TreatmentFilterSidebar
            specialties={specialties}
            categories={categories}
            selectedSpecialty={selectedSpecialty}
            onSelectSpecialty={handleSelectSpecialty}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onReset={handleResetFilters}
            totalCount={treatments.length}
          />

          {/* Treatments Grid */}
          <div className="flex-1 w-full">
            {/* Header info strip */}
            <div className="hidden lg:flex items-center justify-between pb-4 mb-6 border-b border-neutral-border text-xs text-neutral-muted">
              <div>
                Showing <strong className="text-neutral-text">{treatments.length}</strong> available{' '}
                {treatments.length === 1 ? 'treatment' : 'treatments'}
              </div>
              {(selectedSpecialty !== 'All' || selectedCategory !== 'All' || searchTerm) && (
                <div className="flex items-center gap-2">
                  <span className="text-primary font-medium">Active Filters</span>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-neutral-muted hover:text-neutral-text underline underline-offset-2"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Skeletons while loading */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-6 bg-neutral-surface border border-neutral-border rounded-card space-y-4">
                    <div className="flex justify-between">
                      <Skeleton variant="text" className="w-20 h-5" />
                      <Skeleton variant="text" className="w-24 h-4" />
                    </div>
                    <Skeleton variant="text" className="w-3/4 h-6" />
                    <Skeleton variant="text" className="w-full h-12" />
                    <div className="pt-3 border-t border-neutral-border flex justify-between">
                      <Skeleton variant="text" className="w-24 h-4" />
                      <Skeleton variant="text" className="w-16 h-8 rounded-button" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && treatments.length === 0 && (
              <EmptyState
                icon={Search}
                title="No Treatments Found"
                description={
                  searchTerm || selectedSpecialty !== 'All' || selectedCategory !== 'All'
                    ? 'No medical procedures matched your current filter criteria. Try resetting filters or searching for broader terms like "Cardio" or "Knee".'
                    : 'No treatments are published in the directory at this moment.'
                }
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}

            {/* Grid of Treatment Cards */}
            {!loading && treatments.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {treatments.map((treatment) => (
                  <TreatmentCard key={treatment.id} treatment={treatment} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
