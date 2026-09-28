import React from 'react';
import { ConsultationSlot } from '../../types';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export interface SlotPickerProps {
  slots: ConsultationSlot[];
  selectedSlot: ConsultationSlot | null;
  onSelectSlot: (slot: ConsultationSlot) => void;
  doctorName: string;
  loading: boolean;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  doctorName,
  loading,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded-card bg-neutral-surface border border-neutral-border animate-pulse space-y-2">
            <div className="h-4 bg-neutral-bg rounded w-1/4" />
            <div className="flex gap-2">
              <div className="h-8 bg-neutral-bg rounded w-24" />
              <div className="h-8 bg-neutral-bg rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-8 text-center rounded-card bg-neutral-surface border border-neutral-border space-y-3">
        <AlertCircle className="w-8 h-8 text-status-warning mx-auto" />
        <h4 className="text-sm font-bold text-neutral-text">
          No Scheduled Open Slots for {doctorName}
        </h4>
        <p className="text-xs text-neutral-muted max-w-md mx-auto leading-relaxed">
          Dr. {doctorName} has not published open booking slots for the next 14 days. You can proceed to step 4 to submit a priority consultation request, and our clinical coordinator will open an immediate slot for your case.
        </p>
      </div>
    );
  }

  // Group slots by date
  const groupedSlots = slots.reduce<Record<string, ConsultationSlot[]>>((acc, slot) => {
    const dateKey = new Date(slot.start_time).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-border pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-heading font-bold text-neutral-text flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Select Appointment Date &amp; Time</span>
          </h3>
          <p className="text-xs text-neutral-muted mt-0.5">
            All consultation timings are displayed in Indian Standard Time (IST / UTC+5:30).
          </p>
        </div>
        {selectedSlot && (
          <span className="text-xs font-semibold text-status-success flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Slot Chosen
          </span>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(groupedSlots).map(([dateLabel, dateSlots]) => (
          <div
            key={dateLabel}
            className="p-4 rounded-card bg-neutral-surface border border-neutral-border space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-text">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{dateLabel}</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {dateSlots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                const startTimeStr = formatTime(slot.start_time);
                const endTimeStr = formatTime(slot.end_time);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelectSlot(slot)}
                    className={`px-3 py-2 rounded-button text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-primary text-white shadow-subtle ring-2 ring-primary/20'
                        : 'bg-neutral-bg text-neutral-text border border-neutral-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {startTimeStr} – {endTimeStr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

