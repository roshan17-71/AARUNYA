import React, { useState, useEffect } from 'react';
import { ConsultationSlot } from '../../types';
import { doctorsService } from '../../services/doctors.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export interface AvailabilitySlotManagerProps {
  doctorId: string;
}

export const AvailabilitySlotManager: React.FC<AvailabilitySlotManagerProps> = ({
  doctorId,
}) => {
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:30');
  const [addingSlot, setAddingSlot] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadSlots = async () => {
    try {
      const data = await doctorsService.getDoctorSlots(doctorId);
      setSlots(data);
    } catch (err) {
      console.error('[AvailabilitySlotManager] Error loading slots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [doctorId]);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      setMessage({ type: 'error', text: 'Please select a date, start time, and end time.' });
      return;
    }

    const startIso = new Date(`${date}T${startTime}:00`).toISOString();
    const endIso = new Date(`${date}T${endTime}:00`).toISOString();

    if (new Date(endIso) <= new Date(startIso)) {
      setMessage({ type: 'error', text: 'End time must be after start time.' });
      return;
    }

    setAddingSlot(true);
    setMessage(null);

    const { data, error } = await doctorsService.addConsultationSlot(doctorId, startIso, endIso);
    setAddingSlot(false);

    if (error || !data) {
      setMessage({ type: 'error', text: error || 'Failed to add appointment slot.' });
    } else {
      setMessage({ type: 'success', text: 'Appointment slot added successfully!' });
      setSlots((prev) => [...prev, data]);
    }
  };

  const handleDeleteSlot = async (slot: ConsultationSlot) => {
    if (slot.is_booked) {
      alert('Cannot delete an appointment slot that is already booked by a patient.');
      return;
    }

    setDeletingId(slot.id);
    setMessage(null);

    const { success, error } = await doctorsService.deleteConsultationSlot(slot.id);
    setDeletingId(null);

    if (success) {
      setSlots((prev) => prev.filter((s) => s.id !== slot.id));
      setMessage({ type: 'success', text: 'Slot removed.' });
    } else {
      setMessage({ type: 'error', text: error || 'Failed to remove slot.' });
    }
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-md text-xs font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-status-success/10 border border-status-success/20 text-status-success'
              : 'bg-status-error/10 border border-status-error/20 text-status-error'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add Slot Form */}
      <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 shadow-sm space-y-4">
        <div className="border-b border-neutral-border pb-3">
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Add Upcoming Telehealth Slot</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            Patients can book video appointments only against published available slots.
          </p>
        </div>

        <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-neutral-text block mb-1.5">
              Appointment Date
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-text block mb-1.5">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-text block mb-1.5">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full text-xs py-2 px-3 rounded-input bg-neutral-bg border border-neutral-border text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <Button type="submit" variant="primary" size="md" isLoading={addingSlot} className="w-full justify-center">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Slot</span>
          </Button>
        </form>
      </div>

      {/* Slots List */}
      <div className="bg-neutral-surface border border-neutral-border rounded-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-border pb-3">
          <div>
            <h4 className="text-sm font-heading font-bold text-neutral-text">
              Active Consultation Schedule ({slots.length} slots)
            </h4>
            <p className="text-xs text-neutral-muted">
              Booked slots cannot be deleted to preserve patient booking commitments.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 py-4">
            <div className="h-10 bg-neutral-bg rounded animate-pulse" />
            <div className="h-10 bg-neutral-bg rounded animate-pulse" />
          </div>
        ) : slots.length === 0 ? (
          <div className="py-6">
            <EmptyState
              icon={Calendar}
              title="No Upcoming Slots"
              description="Add your first availability slot above so overseas patients can book teleconsultations with you."
            />
          </div>
        ) : (
          <div className="divide-y divide-neutral-border">
            {slots.map((slot) => {
              const startFmt = formatDateTime(slot.start_time);
              const endFmt = formatDateTime(slot.end_time);

              return (
                <div
                  key={slot.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary-light text-primary">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-text block">
                        {startFmt.date}
                      </span>
                      <span className="text-neutral-muted">
                        {startFmt.time} – {endFmt.time} (IST)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {slot.is_booked ? (
                      <Badge variant="warning" size="sm">
                        Booked by Patient
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Available for Booking
                      </Badge>
                    )}

                    {!slot.is_booked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSlot(slot)}
                        isLoading={deletingId === slot.id}
                        className="text-xs text-status-error hover:bg-status-error/10 hover:text-status-error p-1.5"
                        title="Remove slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
