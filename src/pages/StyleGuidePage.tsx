import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StyleGuidePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="py-10 bg-neutral-bg min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-neutral-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary">Phase 1 Visual Verification</Badge>
              <span className="text-xs text-neutral-muted">Internal Dev Tool</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-neutral-text">
              AARUNYA Design System & UI Primitives
            </h1>
            <p className="text-sm text-neutral-muted mt-1">
              Master style guide for colors, typography, layout, and UI components defined in §7.1 &amp; §10.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/preview/dashboard">
              <Button variant="outline" size="sm">
                Dashboard Shell
              </Button>
            </Link>
            <Link to="/preview/admin">
              <Button variant="outline" size="sm">
                Admin Shell
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 1: Color Tokens */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-text mb-4 flex items-center gap-2">
            <span>1. Design Tokens — Color Palette</span>
            <span className="text-xs font-normal text-neutral-muted">§7.1</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {/* Primary */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-primary mb-2 flex items-end p-2 text-white text-[11px] font-mono">
                #0F6E6E
              </div>
              <p className="text-xs font-semibold text-neutral-text">Primary Teal</p>
              <p className="text-[11px] text-neutral-muted">Trust, healthcare</p>
            </div>

            {/* Primary Dark */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-primary-hover mb-2 flex items-end p-2 text-white text-[11px] font-mono">
                #0B5A6B
              </div>
              <p className="text-xs font-semibold text-neutral-text">Primary Hover</p>
              <p className="text-[11px] text-neutral-muted">Interactive state</p>
            </div>

            {/* Accent Gold */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-accent mb-2 flex items-end p-2 text-white text-[11px] font-mono">
                #C89B3C
              </div>
              <p className="text-xs font-semibold text-neutral-text">Accent Gold</p>
              <p className="text-[11px] text-neutral-muted">Premium CTAs</p>
            </div>

            {/* Background */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-neutral-bg border border-neutral-border mb-2 flex items-end p-2 text-neutral-muted text-[11px] font-mono">
                #FAFAF8
              </div>
              <p className="text-xs font-semibold text-neutral-text">Neutral Bg</p>
              <p className="text-[11px] text-neutral-muted">Warm, calm canvas</p>
            </div>

            {/* Surface */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-white border border-neutral-border mb-2 flex items-end p-2 text-neutral-muted text-[11px] font-mono">
                #FFFFFF
              </div>
              <p className="text-xs font-semibold text-neutral-text">Surface / Card</p>
              <p className="text-[11px] text-neutral-muted">Clean contrast</p>
            </div>

            {/* Border */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-neutral-border mb-2 flex items-end p-2 text-neutral-muted text-[11px] font-mono">
                #E9EAE6
              </div>
              <p className="text-xs font-semibold text-neutral-text">Subtle Border</p>
              <p className="text-[11px] text-neutral-muted">Dividers &amp; outlines</p>
            </div>

            {/* Text Primary */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-neutral-text mb-2 flex items-end p-2 text-white text-[11px] font-mono">
                #1E2422
              </div>
              <p className="text-xs font-semibold text-neutral-text">Text Primary</p>
              <p className="text-[11px] text-neutral-muted">Near-black warm gray</p>
            </div>

            {/* Text Secondary */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-neutral-muted mb-2 flex items-end p-2 text-white text-[11px] font-mono">
                #5B6360
              </div>
              <p className="text-xs font-semibold text-neutral-text">Text Muted</p>
              <p className="text-[11px] text-neutral-muted">Secondary descriptions</p>
            </div>

            {/* Success */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-status-success mb-2 flex items-end p-2 text-white text-[11px] font-mono">
                #2F855A
              </div>
              <p className="text-xs font-semibold text-neutral-text">Status Success</p>
              <p className="text-[11px] text-neutral-muted">Approved / Valid</p>
            </div>

            {/* Warning */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-status-warning mb-2 flex items-end p-2 text-white text-[11px] font-mono">
                #B7791F
              </div>
              <p className="text-xs font-semibold text-neutral-text">Status Warning</p>
              <p className="text-[11px] text-neutral-muted">Pending review</p>
            </div>

            {/* Error */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-status-error mb-2 flex items-end p-2 text-white text-[11px] font-mono">
                #C53030
              </div>
              <p className="text-xs font-semibold text-neutral-text">Status Error</p>
              <p className="text-[11px] text-neutral-muted">Rejected / Invalid</p>
            </div>

            {/* Info */}
            <div className="p-3 bg-neutral-surface border border-neutral-border rounded-card">
              <div className="h-16 rounded-md bg-status-info mb-2 flex items-end p-2 text-white text-[11px] font-mono">
                #2B6CB0
              </div>
              <p className="text-xs font-semibold text-neutral-text">Status Info</p>
              <p className="text-[11px] text-neutral-muted">Guidance / Notes</p>
            </div>
          </div>
        </section>

        {/* Section 2: Typography */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-text mb-4">
            2. Typography Hierarchy
          </h2>
          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-mono text-neutral-muted mb-1">
                  font-heading (Playfair Display) — For Hero Headings &amp; Brand Marks
                </p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-neutral-text">
                  World-Class Medical Care in India
                </h1>
              </div>
              <div className="pt-2 border-t border-neutral-border">
                <p className="text-xs font-mono text-neutral-muted mb-1">
                  font-sans (Inter) — Heading 2 / Section Titles
                </p>
                <h2 className="text-2xl font-bold text-neutral-text">
                  Discover Accredited Hospitals &amp; Verified Specialists
                </h2>
              </div>
              <div className="pt-2 border-t border-neutral-border">
                <p className="text-xs font-mono text-neutral-muted mb-1">
                  font-sans (Inter) — Body Regular &amp; Muted
                </p>
                <p className="text-sm text-neutral-text leading-relaxed">
                  AARUNYA connects patients worldwide to premier medical centers with accredited quality standards. We provide transparent procedure estimates and verified doctor credentials without hidden fees.
                </p>
                <p className="text-xs text-neutral-muted mt-1">
                  Note: All medical fees and recovery timelines are estimated and subject to clinical case review.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 3: Buttons */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-text mb-4">
            3. Buttons &amp; Interactive States
          </h2>
          <Card>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-neutral-muted uppercase tracking-wider mb-3">
                  Variants
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="accent">Accent CTA</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-border">
                <p className="text-xs font-semibold text-neutral-muted uppercase tracking-wider mb-3">
                  Sizes
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small (sm)</Button>
                  <Button size="md">Medium (md)</Button>
                  <Button size="lg">Large (lg)</Button>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-border">
                <p className="text-xs font-semibold text-neutral-muted uppercase tracking-wider mb-3">
                  States
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button isLoading>Submitting...</Button>
                  <Button disabled>Disabled Action</Button>
                  <Button variant="accent" size="sm">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    With Icon
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 4: Form Inputs & Selects */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-text mb-4">
            4. Form Controls (Input &amp; Select)
          </h2>
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                helperText="As it appears on your passport or identity card."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />

              <Input
                label="Email Address"
                placeholder="patient@example.com"
                required
                defaultValue="invalid-email"
                error="Please enter a valid email address."
              />

              <Select
                label="Medical Specialty"
                required
                options={[
                  { value: '', label: 'Select specialty...' },
                  { value: 'cardiology', label: 'Cardiology & Heart Surgery' },
                  { value: 'oncology', label: 'Oncology / Cancer Care' },
                  { value: 'orthopedics', label: 'Orthopedics & Joint Replacement' },
                  { value: 'neurology', label: 'Neurology & Neurosurgery' },
                ]}
              />

              <Input
                label="Disabled Field"
                disabled
                defaultValue="System generated reference code"
                helperText="This field is locked."
              />
            </div>
          </Card>
        </section>

        {/* Section 5: Badges */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-text mb-4">
            5. Status Badges
          </h2>
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary Active</Badge>
              <Badge variant="secondary">Premium Package</Badge>
              <Badge variant="success">Approved</Badge>
              <Badge variant="warning">Pending Review</Badge>
              <Badge variant="error">Suspended</Badge>
              <Badge variant="info">JCI Accredited</Badge>
              <Badge variant="success" size="sm">
                Small Badge
              </Badge>
            </div>
          </Card>
        </section>

        {/* Section 6: Cards */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-text mb-4">
            6. Cards &amp; Container Elevation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="info">Hospital</Badge>
                  <span className="text-xs text-neutral-muted">New Delhi</span>
                </div>
                <CardTitle>Apollo Hospitals</CardTitle>
                <CardDescription>
                  Joint Commission International (JCI) Accredited Center
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-neutral-muted line-clamp-2">
                  Multi-specialty tertiary care hospital with over 700 beds and specialized cardiac surgical suites.
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-status-success font-medium">Verified Partner</span>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </CardFooter>
            </Card>

            <Card hoverEffect>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="secondary">Specialist</Badge>
                  <span className="text-xs text-neutral-muted">22+ Yrs Exp</span>
                </div>
                <CardTitle>Dr. Naresh Trehan</CardTitle>
                <CardDescription>Cardiovascular &amp; Thoracic Surgery</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-neutral-muted line-clamp-2">
                  Pioneer in minimally invasive cardiac surgery and complex coronary bypass operations.
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs font-semibold text-primary">$80 / Consult</span>
                <Button variant="primary" size="sm">
                  Book Slot
                </Button>
              </CardFooter>
            </Card>

            <Card hoverEffect>
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="warning">Package</Badge>
                  <span className="text-xs text-neutral-muted">3 Days</span>
                </div>
                <CardTitle>Executive Cardiac Checkup</CardTitle>
                <CardDescription>Comprehensive Health Screening</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-neutral-muted line-clamp-2">
                  Includes 2D Echo, Stress Test (TMT), CT Calcium Scoring, and full biochemical panel.
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs font-semibold text-neutral-text">$350 Est.</span>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Section 7: Tabs, Modal, Skeletons, Empty State */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-neutral-text mb-4">
            7. Tabs, Skeletons, Modal &amp; Empty State
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabs & Modal trigger */}
            <Card>
              <CardTitle className="mb-4">Tabs &amp; Modal Interaction</CardTitle>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="process">Process</TabsTrigger>
                  <TabsTrigger value="modal">Modal Demo</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <p className="text-xs text-neutral-muted leading-relaxed">
                    Patients upload existing scans and records. Dedicated coordinators translate case files and match them with board-certified department heads.
                  </p>
                </TabsContent>
                <TabsContent value="process">
                  <ul className="text-xs text-neutral-muted space-y-1 list-disc list-inside">
                    <li>Step 1: Document review</li>
                    <li>Step 2: Video consultation</li>
                    <li>Step 3: Visa and hospital admission</li>
                  </ul>
                </TabsContent>
                <TabsContent value="modal">
                  <div className="py-2">
                    <p className="text-xs text-neutral-muted mb-3">
                      Test dialog backdrop, escape key handler, and focus containment:
                    </p>
                    <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm">
                      Open Sample Modal
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Skeletons */}
            <Card>
              <CardTitle className="mb-3">Skeleton Loading States</CardTitle>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="w-10 h-10" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton variant="text" className="w-1/2" />
                    <Skeleton variant="text" className="w-1/3" />
                  </div>
                </div>
                <Skeleton variant="rectangular" className="w-full h-16" />
                <div className="flex gap-2">
                  <Skeleton variant="rectangular" className="w-24 h-8" />
                  <Skeleton variant="rectangular" className="w-24 h-8" />
                </div>
              </div>
            </Card>
          </div>

          {/* Empty State */}
          <div className="mt-6">
            <EmptyState
              icon={Calendar}
              title="No Upcoming Consultations"
              description="You do not have any scheduled appointments yet. Browse verified doctors or request a second opinion."
              actionLabel="Find a Specialist"
              onAction={() => alert('EmptyState action clicked')}
            />
          </div>
        </section>
      </Container>

      {/* Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Consultation Request"
        description="This modal validates backdrop blur, escape keys, and responsive layout."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Confirm Request
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-neutral-muted">
            International patient coordinators will review your clinical history within 24 business hours.
          </p>
          <div className="p-3 bg-primary-light/60 rounded-md border border-primary/20 text-xs text-primary flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Strict privacy and HIPAA-aligned security protocols applied.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

