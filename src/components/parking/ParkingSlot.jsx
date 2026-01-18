import { Car, Wrench, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  available: {
    bg: 'bg-green-50 hover:bg-green-100',
    border: 'border-green-400 hover:border-green-500',
    text: 'text-green-700',
    icon: null,
    label: 'Available',
  },
  occupied: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-700',
    icon: Car,
    label: 'Occupied',
  },
  reserved: {
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'border-amber-400 hover:border-amber-500',
    text: 'text-amber-700',
    icon: Clock,
    label: 'Reserved',
  },
  maintenance: {
    bg: 'bg-gray-100',
    border: 'border-gray-400',
    text: 'text-gray-600',
    icon: Wrench,
    label: 'Maintenance',
  },
};

const ParkingSlotComponent = ({ slot, onClick, compact = false }) => {
  const config = statusConfig[slot.status] || statusConfig.available;
  const StatusIcon = config.icon;
  const isClickable = slot.status === 'available' || slot.status === 'reserved';

  return (
    <button
      onClick={() => isClickable && onClick?.(slot)}
      disabled={!isClickable}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300',
        config.bg,
        config.border,
        config.text,
        isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed opacity-80',
        compact ? 'h-16 w-16 p-1' : 'h-24 w-full p-3'
      )}
    >
      {StatusIcon && (
        <StatusIcon className={cn('mb-1', compact ? 'h-4 w-4' : 'h-6 w-6')} />
      )}
      <span className={cn('font-semibold', compact ? 'text-xs' : 'text-sm')}>
        {slot.slot_number}
      </span>
      {!compact && (
        <span className="text-xs opacity-75 mt-0.5">{config.label}</span>
      )}
      
      {/* Pulse animation for available slots */}
      {slot.status === 'available' && (
        <span className="absolute inset-0 rounded-xl animate-pulse-glow opacity-50" />
      )}
    </button>
  );
};

export default ParkingSlotComponent;
