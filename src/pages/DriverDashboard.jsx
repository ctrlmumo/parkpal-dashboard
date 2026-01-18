import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParking } from '@/contexts/ParkingContext';
import Header from '@/components/layout/Header';
import ParkingGrid from '@/components/parking/ParkingGrid';
import BookingModal from '@/components/booking/BookingModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Car, Navigation } from 'lucide-react';
import { format } from 'date-fns';

const DriverDashboard = () => {
  const { getUserDisplayName } = useAuth();
  const { reservations, parkingLot } = useParking();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeReservations = reservations.filter(r => r.status === 'active' && r.payment_status === 'completed');

  const handleSlotSelect = (slot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
      setIsModalOpen(true);
    }
  };

  const handleNavigate = (slotNumber) => {
    // Open Google Maps with the parking location
    window.open(`https://www.google.com/maps/search/parking+slot+${slotNumber}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Welcome back, {getUserDisplayName()}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Find and reserve your parking spot
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{parkingLot.name} - {parkingLot.location}</span>
          </div>
        </div>

        {/* Active Reservations */}
        {activeReservations.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Your Active Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {activeReservations.map(reservation => (
                  <div 
                    key={reservation.id}
                    className="flex items-center justify-between rounded-xl bg-background p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground font-bold">
                        {reservation.slot_number}
                      </div>
                      <div>
                        <p className="font-medium">{reservation.vehicle_number}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Expires {format(new Date(reservation.end_time), 'h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNavigate(reservation.slot_number)}
                      className="gap-1"
                    >
                      <Navigation className="h-4 w-4" />
                      Navigate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parking Grid */}
        <ParkingGrid onSlotSelect={handleSlotSelect} />
      </main>

      {/* Booking Modal */}
      <BookingModal
        slot={selectedSlot}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
      />
    </div>
  );
};

export default DriverDashboard;
