import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { 
  Car, 
  MapPin, 
  CreditCard, 
  Clock, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Availability',
    description: 'See available parking spots instantly with live updates',
  },
  {
    icon: CreditCard,
    title: 'M-Pesa Integration',
    description: 'Seamless mobile money payments for quick checkout',
  },
  {
    icon: Clock,
    title: 'Flexible Duration',
    description: 'Book for 1 hour or the whole day - your choice',
  },
  {
    icon: Shield,
    title: 'Secure Reservations',
    description: 'Your spot is guaranteed once you book',
  },
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <Smartphone className="h-4 w-4" />
              <span>Kenya's Smart Parking Solution</span>
            </div>
            
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Find & Reserve Parking
              <span className="block text-primary">In Seconds</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              No more circling around looking for parking. ParkHub shows you available 
              spots in real-time and lets you reserve with M-Pesa.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>50+ Parking Locations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>10,000+ Happy Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>M-Pesa Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Why Choose ParkHub?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The smartest way to park in Nairobi
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-glow">
              <Car className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ready to Park Smarter?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of drivers who've made parking hassle-free
            </p>
            <Button variant="hero" size="xl" className="mt-8" onClick={handleGetStarted}>
              Start Parking Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">ParkHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 ParkHub. Smart Parking for Smart Drivers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
