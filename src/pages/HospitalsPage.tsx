import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Hospital } from '../types';
import { hospitalsService } from '../services/hospitals.service';
import { Container } from '../components/layout/Container';
import { HospitalCard } from '../components/cards/HospitalCard';
import { HospitalFilterSidebar } from '../features/hospitals/HospitalFilterSidebar';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Building2, Search } from 'lucide-react';

export const HospitalsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [accreditations, setAccreditations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Read URL query params
  const initialSearch = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || 'All';
  const initialSpecialty = searchParams.get('specialty') || 'All';
  const initialAccreditation = searchParams.get('accreditation') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [selectedAccreditation, setSelectedAccreditation] = useState(initialAccreditation);

  // Sync state with URL params
  const updateUrlParams = (search: string, city: string, specialty: string, accreditation: string) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (city && city !== 'All') params.set('city', city);
    if (specialty && specialty !== 'All') params.set('specialty', specialty);
    if (accreditation && accreditation !== 'All') params.set('accreditation', accreditation);
    setSearchParams(params, { replace: true });
  };

  // Fetch filter taxonomy on mount
  useEffect(() => {
    const loadTaxonomy = async () => {
      const [allCities, allSpecialties, allAccreditations] = await Promise.all([
        hospitalsService.getDistinctCities(),
        hospitalsService.getDistinctSpecialties(),
        hospitalsService.getDistinctAccreditations(),
      ]);
      setCities(allCities);
      setSpecialties(allSpecialties);
      setAccreditations(allAccreditations);
    };
    loadTaxonomy();
  }, []);

  // Fetch hospitals when filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    hospitalsService
      .getHospitals({
        search: searchTerm,
        city: selectedCity,
        specialty: selectedSpecialty,
        accreditation: selectedAccreditation,
      })
      .then((data) => {
        if (!isMounted) return;
        setHospitals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[HospitalsPage] Error fetching hospitals:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedCity, selectedSpecialty, selectedAccreditation]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    updateUrlParams(term, selectedCity, selectedSpecialty, selectedAccreditation);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    updateUrlParams(searchTerm, city, selectedSpecialty, selectedAccreditation);
  };

  const handleSelectSpecialty = (spec: string) => {
    setSelectedSpecialty(spec);
    updateUrlParams(searchTerm, selectedCity, spec, selectedAccreditation);
  };

  const handleSelectAccreditation = (acc: string) => {
    setSelectedAccreditation(acc);
    updateUrlParams(searchTerm, selectedCity, selectedSpecialty, acc);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCity('All');
    setSelectedSpecialty('All');
    setSelectedAccreditation('All');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="py-10 sm:py-16 bg-neutral-bg min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center sm:text-left border-b border-neutral-border pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="primary" size="md">
              <Building2 className="w-3.5 h-3.5 mr-1" />
              NABH &amp; JCI Accredited Hospital Network
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-text">
            Premier Hospitals in India
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-muted max-w-3xl leading-relaxed">
            Discover tertiary medical institutions equipped with robotic surgical suites, internationally trained clinical department heads, and dedicated multilingual international patient lounges.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Filter Sidebar */}
          <HospitalFilterSidebar
            cities={cities}
            specialties={specialties}
            accreditations={accreditations}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
            selectedSpecialty={selectedSpecialty}
            onSelectSpecialty={handleSelectSpecialty}
            selectedAccreditation={selectedAccreditation}
            onSelectAccreditation={handleSelectAccreditation}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onReset={handleResetFilters}
            totalCount={hospitals.length}
          />

          {/* Hospitals Grid */}
          <div className="flex-1 w-full">
            {/* Header info strip */}
            <div className="hidden lg:flex items-center justify-between pb-4 mb-6 border-b border-neutral-border text-xs text-neutral-muted">
              <div>
                Showing <strong className="text-neutral-text">{hospitals.length}</strong> accredited{' '}
                {hospitals.length === 1 ? 'hospital' : 'hospitals'}
              </div>
              {(selectedCity !== 'All' ||
                selectedSpecialty !== 'All' ||
                selectedAccreditation !== 'All' ||
                searchTerm) && (
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
                  <div key={i} className="p-4 bg-neutral-surface border border-neutral-border rounded-card space-y-4">
                    <Skeleton variant="rectangular" className="w-full h-44 rounded-md" />
                    <Skeleton variant="text" className="w-3/4 h-6" />
                    <Skeleton variant="text" className="w-full h-10" />
                    <div className="pt-3 border-t border-neutral-border flex justify-between">
                      <Skeleton variant="text" className="w-24 h-4" />
                      <Skeleton variant="text" className="w-20 h-8 rounded-button" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && hospitals.length === 0 && (
              <EmptyState
                icon={Search}
                title="No Hospitals Found"
                description={
                  searchTerm || selectedCity !== 'All' || selectedSpecialty !== 'All' || selectedAccreditation !== 'All'
                    ? 'No accredited hospitals matched your current filter criteria. Try resetting filters or choosing another city in India.'
                    : 'No approved hospitals are currently listed in the directory.'
                }
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}

            {/* Grid of Hospital Cards */}
            {!loading && hospitals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hospitals.map((hospital) => (
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

