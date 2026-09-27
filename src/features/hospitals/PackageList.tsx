import React, { useState } from 'react';
import { Package } from '../../types';
import { packagesService } from '../../services/packages.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { PackageFormModal } from './PackageFormModal';
import { Plus, Edit2, Trash2, Box, Clock, DollarSign, CheckCircle2 } from 'lucide-react';

export interface PackageListProps {
  hospitalId: string;
  initialPackages: Package[];
}

export const PackageList: React.FC<PackageListProps> = ({ hospitalId, initialPackages }) => {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = async (pkg: Package) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the package "${pkg.name}"?`
    );
    if (!confirmed) return;

    setDeletingId(pkg.id);
    setDeleteError(null);

    const { success, error } = await packagesService.deletePackage(pkg.id);
    setDeletingId(null);

    if (success) {
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
    } else {
      setDeleteError(error || 'Failed to delete package');
    }
  };

  const handleSaveSuccess = (savedPackage: Package) => {
    setPackages((prev) => {
      const exists = prev.some((p) => p.id === savedPackage.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPackage.id ? savedPackage : p));
      }
      return [savedPackage, ...prev];
    });
  };

  const getStatusBadgeVariant = (status: Package['status']): 'success' | 'warning' | 'default' => {
    if (status === 'published') return 'success';
    if (status === 'draft') return 'warning';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-surface border border-neutral-border rounded-card p-4 sm:p-6 shadow-sm">
        <div>
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" />
            <span>Hospital Medical &amp; Checkup Packages</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-1">
            Manage transparent health checkup packages and clinical bundled offerings visible to international patients.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleCreateNew} className="shrink-0 self-start sm:self-auto">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Package</span>
        </Button>
      </div>

      {deleteError && (
        <div className="p-3 text-xs rounded-md bg-status-error/10 border border-status-error/20 text-status-error">
          {deleteError}
        </div>
      )}

      {/* Package List or Empty State */}
      {packages.length === 0 ? (
        <div className="bg-neutral-surface border border-neutral-border rounded-card p-10">
          <EmptyState
            icon={Box}
            title="No Packages Created Yet"
            description="Offer comprehensive health checkups or surgical packages with transparent pricing to help overseas patients select your hospital."
            actionLabel="Create First Package"
            onAction={handleCreateNew}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-neutral-surface border border-neutral-border rounded-card p-5 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={getStatusBadgeVariant(pkg.status)} size="sm">
                    {pkg.status.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] font-medium text-neutral-muted">
                    {pkg.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-base text-neutral-text line-clamp-1">
                    {pkg.name}
                  </h4>
                  {pkg.description && (
                    <p className="text-xs text-neutral-muted mt-1 line-clamp-2 leading-relaxed">
                      {pkg.description}
                    </p>
                  )}
                </div>

                {/* Key Details Pill strip */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-muted pt-2 border-t border-neutral-border/60">
                  {pkg.estimated_price !== null && (
                    <span className="inline-flex items-center gap-1 font-semibold text-neutral-text">
                      <DollarSign className="w-3.5 h-3.5 text-primary" />
                      {pkg.currency} {pkg.estimated_price.toLocaleString()}
                    </span>
                  )}
                  {pkg.duration && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {pkg.duration}
                    </span>
                  )}
                </div>

                {/* Included Services Snippet */}
                {pkg.included_services && pkg.included_services.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <p className="text-[11px] font-semibold text-neutral-subtle uppercase tracking-wider">
                      Includes ({pkg.included_services.length} services):
                    </p>
                    <ul className="text-xs text-neutral-muted space-y-1">
                      {pkg.included_services.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 line-clamp-1">
                          <CheckCircle2 className="w-3 h-3 text-status-success shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {pkg.included_services.length > 3 && (
                        <li className="text-[11px] text-primary font-medium pl-4">
                          +{pkg.included_services.length - 3} more services included
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-neutral-border flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(pkg)}
                  className="text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1 text-neutral-muted" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(pkg)}
                  isLoading={deletingId === pkg.id}
                  className="text-xs text-status-error hover:bg-status-error/10 hover:text-status-error"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Form Modal */}
      {isModalOpen && (
        <PackageFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hospitalId={hospitalId}
          packageToEdit={editingPackage}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
};

