import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Car, LogOut, Menu, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-md">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">ParkHub</span>
        </Link>

        {isAuthenticated ? (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {user?.role === 'driver' && (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    My Bookings
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/admin/slots" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Slot Management
                  </Link>
                  <Link to="/admin/users" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Users
                  </Link>
                </>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col gap-6 pt-6">
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                    </div>
                    
                    <nav className="flex flex-col gap-2">
                      {user?.role === 'driver' && (
                        <>
                          <Link to="/dashboard" className="px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                            Dashboard
                          </Link>
                          <Link to="/bookings" className="px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                            My Bookings
                          </Link>
                        </>
                      )}
                      {user?.role === 'admin' && (
                        <>
                          <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                            Dashboard
                          </Link>
                          <Link to="/admin/slots" className="px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                            Slot Management
                          </Link>
                          <Link to="/admin/users" className="px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                            Users
                          </Link>
                        </>
                      )}
                    </nav>
                    
                    <Button variant="destructive" onClick={handleLogout} className="mt-auto">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
