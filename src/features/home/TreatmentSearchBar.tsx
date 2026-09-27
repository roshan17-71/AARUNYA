import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Stethoscope, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const TreatmentSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const navigate = useNavigate();

  const specialties = [
    'All Specialties',
    'Cardiology & Heart Surgery',
    'Oncology & Cancer Care',
    'Orthopedics & Joint Replacement',
    'Neurology & Neurosurgery',
    'Organ Transplantation',
    'Gastroenterology',
    'Spine Surgery',
    'Cosmetic & Plastic Surgery',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('q', searchTerm.trim());
    if (specialty && specialty !== 'All Specialties') params.append('specialty', specialty);

    navigate(`/treatments?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl mx-auto bg-neutral-surface border border-neutral-border rounded-card shadow-dropdown p-2 sm:p-3"
    >
      <div className="flex flex-col md:flex-row items-center gap-2">
        {/* Keyword Search Input */}
        <div className="flex items-center gap-2.5 px-3 py-2 w-full md:flex-1 border-b md:border-b-0 md:border-r border-neutral-border">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            placeholder="Search procedure (e.g. Heart Bypass, Hip Replacement)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm text-neutral-text placeholder:text-neutral-subtle bg-transparent focus:outline-none"
          />
        </div>

        {/* Specialty Dropdown */}
        <div className="flex items-center gap-2 px-3 py-2 w-full md:w-64">
          <Stethoscope className="w-4 h-4 text-neutral-muted shrink-0" />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full text-xs sm:text-sm text-neutral-text bg-transparent focus:outline-none cursor-pointer"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Search Submit Button */}
        <div className="w-full md:w-auto">
          <Button type="submit" variant="primary" size="md" className="w-full md:w-auto whitespace-nowrap">
            <span>Find Care</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </form>
  );
};

