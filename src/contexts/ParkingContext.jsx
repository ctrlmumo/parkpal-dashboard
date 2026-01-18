import { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * Data structures matching database schema:
 * 
 * ParkingLot:
 * - id: INT
 * - name: VARCHAR(100)
 * - location: VARCHAR(150)
 * - admin_id: INT (FK to users)
 * - created_at: DATETIME
 * 
 * ParkingSlot:
 * - id: INT
 * - parking_lot_id: INT (FK to parking_lots)
 * - slot_number: VARCHAR(20)
 * - status: 'available' | 'reserved' | 'occupied'
 * - created_at: DATETIME
 * 
 * Reservation:
 * - id: INT
 * - user_id: INT (FK to users)
 * - parking_slot_id: INT (FK to parking_slots)
 * - start_time: DATETIME
 * - end_time: DATETIME
 * - status: 'active' | 'cancelled' | 'completed'
 * - created_at: DATETIME
 */

const ParkingContext = createContext(undefined);

// Generate mock parking lot
const generateParkingLot = () => ({
  id: 1,
  name: 'ParkHub Central',
  location: 'Nairobi CBD',
  admin_id: 1,
  created_at: new Date().toISOString(),
});

// Generate mock parking slots
const generateSlots = (parkingLotId) => {
  const sections = ['A', 'B', 'C', 'D'];
  const slotsPerSection = 12;
  const slots = [];
  
  let slotId = 1;
  
  sections.forEach(section => {
    for (let i = 1; i <= slotsPerSection; i++) {
      const randomStatus = Math.random();
      let status = 'available';
      
      if (randomStatus < 0.3) status = 'occupied';
      else if (randomStatus < 0.45) status = 'reserved';
      
      slots.push({
        id: slotId++,
        parking_lot_id: parkingLotId,
        slot_number: `${section}${i.toString().padStart(2, '0')}`,
        status,
        created_at: new Date().toISOString(),
        // Additional UI fields (not in DB but useful for display)
        section,
        vehicle_number: status === 'occupied' ? `KA${Math.floor(Math.random() * 90 + 10)}XX${Math.floor(Math.random() * 9000 + 1000)}` : null,
      });
    }
  });
  
  return slots;
};

export const ParkingProvider = ({ children }) => {
  const [parkingLot] = useState(generateParkingLot);
  const [slots, setSlots] = useState(() => generateSlots(1));
  const [reservations, setReservations] = useState([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots(prev => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        const slot = updated[randomIndex];
        
        if (slot.status === 'available' && Math.random() < 0.1) {
          updated[randomIndex] = {
            ...slot,
            status: 'occupied',
            vehicle_number: `KA${Math.floor(Math.random() * 90 + 10)}XX${Math.floor(Math.random() * 9000 + 1000)}`,
          };
        } else if (slot.status === 'occupied' && Math.random() < 0.05) {
          updated[randomIndex] = {
            ...slot,
            status: 'available',
            vehicle_number: null,
          };
        }
        
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const reserveSlot = useCallback(async (slotId, vehicleNumber, durationHours) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || slot.status !== 'available') {
      throw new Error('Slot not available');
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationHours * 3600000);

    const reservation = {
      id: Math.floor(Math.random() * 10000),
      user_id: 1, // Would come from auth context in real app
      parking_slot_id: slotId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'active',
      created_at: new Date().toISOString(),
      // Additional UI fields
      slot_number: slot.slot_number,
      vehicle_number: vehicleNumber,
      amount: durationHours * 50, // 50 KES per hour
      payment_status: 'pending',
    };

    setSlots(prev => prev.map(s => 
      s.id === slotId 
        ? { ...s, status: 'reserved', vehicle_number: vehicleNumber }
        : s
    ));

    setReservations(prev => [...prev, reservation]);
    return reservation;
  }, [slots]);

  const completePayment = useCallback(async (reservationId) => {
    // Simulate M-Pesa payment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setReservations(prev => prev.map(r => 
      r.id === reservationId 
        ? { ...r, payment_status: 'completed' }
        : r
    ));

    return true;
  }, []);

  const updateSlotStatus = useCallback((slotId, status) => {
    setSlots(prev => prev.map(s => 
      s.id === slotId 
        ? { ...s, status, vehicle_number: status === 'available' ? null : s.vehicle_number }
        : s
    ));
  }, []);

  const getSlotById = useCallback((slotId) => {
    return slots.find(s => s.id === slotId);
  }, [slots]);

  const cancelReservation = useCallback((reservationId) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      setReservations(prev => prev.map(r => 
        r.id === reservationId 
          ? { ...r, status: 'cancelled' }
          : r
      ));
      
      setSlots(prev => prev.map(s => 
        s.id === reservation.parking_slot_id 
          ? { ...s, status: 'available', vehicle_number: null }
          : s
      ));
    }
  }, [reservations]);

  return (
    <ParkingContext.Provider value={{
      parkingLot,
      slots,
      reservations,
      reserveSlot,
      completePayment,
      updateSlotStatus,
      getSlotById,
      cancelReservation,
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
