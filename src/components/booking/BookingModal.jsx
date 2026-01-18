import { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Car, Clock, Wallet, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookingModal = ({ slot, isOpen, onClose }) => {
  const { reserveSlot, completePayment } = useParking();
  const { toast } = useToast();
  
  const [step, setStep] = useState('details');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [duration, setDuration] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reservationId, setReservationId] = useState(null);

  const pricePerHour = 50; // KES
  const totalAmount = parseInt(duration) * pricePerHour;

  const handleReset = () => {
    setStep('details');
    setVehicleNumber('');
    setDuration('1');
    setPhoneNumber('');
    setIsLoading(false);
    setReservationId(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleProceedToPayment = () => {
    if (!vehicleNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your vehicle registration number',
        variant: 'destructive',
      });
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      toast({
        title: 'Error',
        description: 'Please enter a valid M-Pesa phone number',
        variant: 'destructive',
      });
      return;
    }

    setStep('processing');
    setIsLoading(true);

    try {
      // Reserve the slot
      const reservation = await reserveSlot(slot.id, vehicleNumber, parseInt(duration));
      setReservationId(reservation.id);
      
      // Simulate M-Pesa payment
      await completePayment(reservation.id);
      
      setStep('success');
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
      setStep('payment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!slot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {step === 'details' && 'Reserve Parking Slot'}
            {step === 'payment' && 'M-Pesa Payment'}
            {step === 'processing' && 'Processing Payment'}
            {step === 'success' && 'Booking Confirmed!'}
          </DialogTitle>
        </DialogHeader>

        {step === 'details' && (
          <div className="space-y-6">
            {/* Slot Info */}
            <div className="flex items-center gap-4 rounded-xl bg-primary/5 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                <span className="text-lg font-bold">{slot.slot_number}</span>
              </div>
              <div>
                <p className="font-semibold">Slot {slot.slot_number}</p>
                <p className="text-sm text-muted-foreground">Section {slot.section}</p>
              </div>
            </div>

            {/* Vehicle Number */}
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle Registration Number</Label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="vehicle"
                  placeholder="e.g., KCA 123X"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Parking Duration</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Hour</SelectItem>
                    <SelectItem value="2">2 Hours</SelectItem>
                    <SelectItem value="3">3 Hours</SelectItem>
                    <SelectItem value="4">4 Hours</SelectItem>
                    <SelectItem value="6">6 Hours</SelectItem>
                    <SelectItem value="12">12 Hours</SelectItem>
                    <SelectItem value="24">24 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Summary */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rate per hour</span>
                <span>KES {pricePerHour}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Duration</span>
                <span>{duration} hour(s)</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary">KES {totalAmount}</span>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={handleProceedToPayment}>
              Proceed to Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            {/* M-Pesa Logo */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00A651]/10">
                <Wallet className="h-8 w-8 text-[#00A651]" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold">KES {totalAmount}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Slot {slot.slot_number} • {duration} hour(s)
              </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You will receive an M-Pesa prompt on this number
              </p>
            </div>

            <Button variant="mpesa" className="w-full" onClick={handlePayment}>
              Pay with M-Pesa
            </Button>

            <Button variant="ghost" className="w-full" onClick={() => setStep('details')}>
              Back to Details
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-[#00A651]/20" />
                <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-[#00A651] border-t-transparent animate-spin" />
                <Wallet className="absolute inset-0 m-auto h-8 w-8 text-[#00A651]" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Waiting for M-Pesa PIN</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please enter your M-Pesa PIN on your phone to complete the payment
              </p>
            </div>

            <div className="flex items-center justify-center gap-1">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Processing...</span>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-scale-in">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your parking slot has been reserved
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-left">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Slot:</span>
                <span className="font-medium">{slot.slot_number}</span>
                <span className="text-muted-foreground">Vehicle:</span>
                <span className="font-medium">{vehicleNumber}</span>
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{duration} hour(s)</span>
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">KES {totalAmount}</span>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
