import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParking, ParkingSlot } from '@/contexts/ParkingContext';
import Header from '@/components/layout/Header';
import ParkingGrid from '@/components/parking/ParkingGrid';
import BookingModal from '@/components/booking/BookingModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Car, Navigation } from 'lucide-react';
import { format } from 'date-fns';

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings } = useParking();
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeBookings = bookings.filter(b => b.status === 'active' && b.paymentStatus === 'completed');

  const handleSlotSelect = (slot: ParkingSlot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
      setIsModalOpen(true);
    }
  };

  const handleNavigate = (slotNumber: string) => {
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
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Find and reserve your parking spot
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>ParkHub Central - Nairobi</span>
          </div>
        </div>

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Your Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {activeBookings.map(booking => (
                  <div 
                    key={booking.id}
                    className="flex items-center justify-between rounded-xl bg-background p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground font-bold">
                        {booking.slotNumber}
                      </div>
                      <div>
                        <p className="font-medium">{booking.vehicleNumber}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{booking.duration}h • Expires {format(new Date(booking.startTime.getTime() + booking.duration * 3600000), 'h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNavigate(booking.slotNumber)}
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
