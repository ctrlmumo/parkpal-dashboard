import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface ParkingSlot {
  id: string;
  number: string;
  section: string;
  status: SlotStatus;
  vehicleNumber?: string;
  reservedBy?: string;
  reservedUntil?: Date;
}

export interface Booking {
  id: string;
  slotId: string;
  slotNumber: string;
  vehicleNumber: string;
  startTime: Date;
  duration: number; // in hours
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentMethod: 'mpesa';
  paymentStatus: 'pending' | 'completed' | 'failed';
}

interface ParkingContextType {
  slots: ParkingSlot[];
  bookings: Booking[];
  reserveSlot: (slotId: string, vehicleNumber: string, duration: number) => Promise<Booking>;
  completePayment: (bookingId: string) => Promise<boolean>;
  updateSlotStatus: (slotId: string, status: SlotStatus) => void;
  getSlotById: (slotId: string) => ParkingSlot | undefined;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

// Generate mock parking slots
const generateSlots = (): ParkingSlot[] => {
  const sections = ['A', 'B', 'C', 'D'];
  const slotsPerSection = 12;
  const slots: ParkingSlot[] = [];
  
  const statuses: SlotStatus[] = ['available', 'occupied', 'reserved', 'maintenance'];
  
  sections.forEach(section => {
    for (let i = 1; i <= slotsPerSection; i++) {
      const randomStatus = Math.random();
      let status: SlotStatus = 'available';
      
      if (randomStatus < 0.3) status = 'occupied';
      else if (randomStatus < 0.45) status = 'reserved';
      else if (randomStatus < 0.5) status = 'maintenance';
      
      slots.push({
        id: `${section}${i}`,
        number: `${section}${i.toString().padStart(2, '0')}`,
        section,
        status,
        vehicleNumber: status === 'occupied' ? `KA${Math.floor(Math.random() * 90 + 10)}XX${Math.floor(Math.random() * 9000 + 1000)}` : undefined,
      });
    }
  });
  
  return slots;
};

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slots, setSlots] = useState<ParkingSlot[]>(generateSlots);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots(prev => {
        const updated = [...prev];
        // Randomly change one slot status
        const randomIndex = Math.floor(Math.random() * updated.length);
        const slot = updated[randomIndex];
        
        if (slot.status === 'available' && Math.random() < 0.1) {
          slot.status = 'occupied';
          slot.vehicleNumber = `KA${Math.floor(Math.random() * 90 + 10)}XX${Math.floor(Math.random() * 9000 + 1000)}`;
        } else if (slot.status === 'occupied' && Math.random() < 0.05) {
          slot.status = 'available';
          slot.vehicleNumber = undefined;
        }
        
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const reserveSlot = useCallback(async (slotId: string, vehicleNumber: string, duration: number): Promise<Booking> => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || slot.status !== 'available') {
      throw new Error('Slot not available');
    }

    const booking: Booking = {
      id: crypto.randomUUID(),
      slotId,
      slotNumber: slot.number,
      vehicleNumber,
      startTime: new Date(),
      duration,
      amount: duration * 50, // 50 KES per hour
      status: 'active',
      paymentMethod: 'mpesa',
      paymentStatus: 'pending',
    };

    setSlots(prev => prev.map(s => 
      s.id === slotId 
        ? { ...s, status: 'reserved' as SlotStatus, vehicleNumber, reservedUntil: new Date(Date.now() + duration * 3600000) }
        : s
    ));

    setBookings(prev => [...prev, booking]);
    return booking;
  }, [slots]);

  const completePayment = useCallback(async (bookingId: string): Promise<boolean> => {
    // Simulate M-Pesa payment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setBookings(prev => prev.map(b => 
      b.id === bookingId 
        ? { ...b, paymentStatus: 'completed' }
        : b
    ));

    return true;
  }, []);

  const updateSlotStatus = useCallback((slotId: string, status: SlotStatus) => {
    setSlots(prev => prev.map(s => 
      s.id === slotId 
        ? { ...s, status, vehicleNumber: status === 'available' ? undefined : s.vehicleNumber }
        : s
    ));
  }, []);

  const getSlotById = useCallback((slotId: string) => {
    return slots.find(s => s.id === slotId);
  }, [slots]);

  return (
    <ParkingContext.Provider value={{
      slots,
      bookings,
      reserveSlot,
      completePayment,
      updateSlotStatus,
      getSlotById,
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
