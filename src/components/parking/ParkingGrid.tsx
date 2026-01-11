import React, { useState } from 'react';
import { useParking, ParkingSlot } from '@/contexts/ParkingContext';
import ParkingSlotComponent from './ParkingSlot';
import { Badge } from '@/components/ui/badge';
import { Car, CircleCheck, Clock, Wrench } from 'lucide-react';

interface ParkingGridProps {
  onSlotSelect: (slot: ParkingSlot) => void;
}

const ParkingGrid: React.FC<ParkingGridProps> = ({ onSlotSelect }) => {
  const { slots } = useParking();
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const sections = ['all', ...new Set(slots.map(s => s.section))];
  
  const filteredSlots = selectedSection === 'all' 
    ? slots 
    : slots.filter(s => s.section === selectedSection);

  const stats = {
    available: slots.filter(s => s.status === 'available').length,
    occupied: slots.filter(s => s.status === 'occupied').length,
    reserved: slots.filter(s => s.status === 'reserved').length,
    maintenance: slots.filter(s => s.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <CircleCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-700">{stats.available}</p>
            <p className="text-xs text-green-600">Available</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
            <Car className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-700">{stats.occupied}</p>
            <p className="text-xs text-red-600">Occupied</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-700">{stats.reserved}</p>
            <p className="text-xs text-amber-600">Reserved</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Wrench className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-700">{stats.maintenance}</p>
            <p className="text-xs text-gray-600">Maintenance</p>
          </div>
        </div>
      </div>

      {/* Section Filter */}
      <div className="flex flex-wrap gap-2">
        {sections.map(section => (
          <Badge
            key={section}
            variant={selectedSection === section ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
            onClick={() => setSelectedSection(section)}
          >
            {section === 'all' ? 'All Sections' : `Section ${section}`}
          </Badge>
        ))}
      </div>

      {/* Parking Grid */}
      <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg font-semibold">
            {selectedSection === 'all' ? 'All Parking Slots' : `Section ${selectedSection}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            Tap an available slot to reserve
          </p>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {filteredSlots.map(slot => (
            <ParkingSlotComponent
              key={slot.id}
              slot={slot}
              onClick={onSlotSelect}
              compact
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-green-400 bg-green-50" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-red-400 bg-red-50" />
          <span className="text-muted-foreground">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-amber-400 bg-amber-50" />
          <span className="text-muted-foreground">Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-gray-400 bg-gray-100" />
          <span className="text-muted-foreground">Maintenance</span>
        </div>
      </div>
    </div>
  );
};

export default ParkingGrid;
