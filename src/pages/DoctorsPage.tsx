import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorsService, DoctorWithRelations } from '../services/doctors.service';
import { Container } from '../components/layout/Container';
import { DoctorCard } from '../components/cards/DoctorCard';
import { DoctorFilterSidebar } from '../features/doctors/DoctorFilterSidebar';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Stethoscope, Search } from 'lucide-react';

export const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [doctors, setDoctors] = useState<DoctorWithRelations[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [hospitals, setHospitals] = useState<{ id: string; name: string; city: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Read URL query params
  const initialSearch = searchParams.get('q') || '';
  const initialSpecialty = searchParams.get('specialty') || 'All';
  const initialCity = searchParams.get('city') || 'All';
  const initialHospital = searchParams.get('hospital') || 'All';
  const initialVideo = searchParams.get('video') === 'true';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedHospitalId, setSelectedHospitalId] = useState(initialHospital);
  const [videoOnly, setVideoOnly] = useState(initialVideo);

  // Sync state with URL params
  const updateUrlParams = (
    search: string,
    specialty: string,
    city: string,
    hospitalId: string,
    video: boolean
  ) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (specialty && specialty !== 'All') params.set('specialty', specialty);
    if (city && city !== 'All') params.set('city', city);
    if (hospitalId && hospitalId !== 'All') params.set('hospital', hospitalId);
    if (video) params.set('video', 'true');
    setSearchParams(params, { replace: true });
  };

  // Fetch filter taxonomies on mount
  useEffect(() => {
    const loadTaxonomy = async () => {
      const [allSpecialties, allCities, allHospitals] = await Promise.all([
        doctorsService.getDistinctSpecialties(),
        doctorsService.getDistinctCities(),
        doctorsService.getApprovedHospitals(),
      ]);
      setSpecialties(allSpecialties);
      setCities(allCities);
      setHospitals(allHospitals);
    };
    loadTaxonomy();
  }, []);

  // Fetch doctors when filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    doctorsService
      .getDoctors({
        search: searchTerm,
        specialty: selectedSpecialty,
        city: selectedCity,
        hospitalId: selectedHospitalId,
        videoOnly,
      })
      .then((data) => {
        if (!isMounted) return;
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[DoctorsPage] Error fetching doctors:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedSpecialty, selectedCity, selectedHospitalId, videoOnly]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    updateUrlParams(term, selectedSpecialty, selectedCity, selectedHospitalId, videoOnly);
  };

  const handleSelectSpecialty = (spec: string) => {
    setSelectedSpecialty(spec);
    updateUrlParams(searchTerm, spec, selectedCity, selectedHospitalId, videoOnly);
  };

  const handleSelectCity = (c: string) => {
    setSelectedCity(c);
    updateUrlParams(searchTerm, selectedSpecialty, c, selectedHospitalId, videoOnly);
  };

  const handleSelectHospitalId = (hospId: string) => {
    setSelectedHospitalId(hospId);
    updateUrlParams(searchTerm, selectedSpecialty, selectedCity, hospId, videoOnly);
  };

  const handleToggleVideo = (val: boolean) => {
    setVideoOnly(val);
    updateUrlParams(searchTerm, selectedSpecialty, selectedCity, selectedHospitalId, val);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('All');
    setSelectedCity('All');
    setSelectedHospitalId('All');
    setVideoOnly(false);
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
              Board-Certified Medical Specialists
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-text">
            Consult India's Leading Doctors
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-muted max-w-3xl leading-relaxed">
            Connect with internationally fellowship-trained chief surgeons, medical directors, and department heads across India's premier accredited hospital networks.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Filter Sidebar */}
          <DoctorFilterSidebar
            specialties={specialties}
            cities={cities}
            hospitals={hospitals}
            selectedSpecialty={selectedSpecialty}
            onSelectSpecialty={handleSelectSpecialty}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
            selectedHospitalId={selectedHospitalId}
            onSelectHospitalId={handleSelectHospitalId}
            videoOnly={videoOnly}
            onToggleVideoOnly={handleToggleVideo}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onReset={handleResetFilters}
            totalCount={doctors.length}
          />

          {/* Doctors Grid */}
          <div className="flex-1 w-full">
            {/* Header info strip */}
            <div className="hidden lg:flex items-center justify-between pb-4 mb-6 border-b border-neutral-border text-xs text-neutral-muted">
              <div>
                Showing <strong className="text-neutral-text">{doctors.length}</strong> verified{' '}
                {doctors.length === 1 ? 'doctor' : 'doctors'}
              </div>
              {(selectedSpecialty !== 'All' ||
                selectedCity !== 'All' ||
                selectedHospitalId !== 'All' ||
                videoOnly ||
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
                  <div key={i} className="p-6 bg-neutral-surface border border-neutral-border rounded-card space-y-4">
                    <div className="flex gap-4">
                      <Skeleton variant="circular" className="w-16 h-16" />
                      <div className="space-y-2 flex-1">
                        <Skeleton variant="text" className="w-20 h-4" />
                        <Skeleton variant="text" className="w-3/4 h-5" />
                        <Skeleton variant="text" className="w-1/2 h-4" />
                      </div>
                    </div>
                    <Skeleton variant="text" className="w-full h-8" />
                    <div className="pt-3 border-t border-neutral-border flex justify-between">
                      <Skeleton variant="text" className="w-24 h-4" />
                      <Skeleton variant="text" className="w-20 h-8 rounded-button" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && doctors.length === 0 && (
              <EmptyState
                icon={Search}
                title="No Specialists Found"
                description={
                  searchTerm || selectedSpecialty !== 'All' || selectedCity !== 'All' || selectedHospitalId !== 'All' || videoOnly
                    ? 'No doctors matched your current filter criteria. Try resetting filters or choosing broader criteria.'
                    : 'No approved doctors are currently listed in the directory.'
                }
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}

            {/* Grid of Doctor Cards */}
            {!loading && doctors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

