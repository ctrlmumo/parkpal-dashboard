import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParking } from '@/contexts/ParkingContext';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car, 
  CircleDollarSign, 
  TrendingUp, 
  Users, 
  Clock,
  ParkingCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for charts
const revenueData = [
  { name: '6AM', revenue: 1200 },
  { name: '8AM', revenue: 2400 },
  { name: '10AM', revenue: 3600 },
  { name: '12PM', revenue: 4800 },
  { name: '2PM', revenue: 5200 },
  { name: '4PM', revenue: 6100 },
  { name: '6PM', revenue: 5800 },
  { name: '8PM', revenue: 4200 },
  { name: '10PM', revenue: 2800 },
];

const occupancyData = [
  { name: 'Mon', occupancy: 85 },
  { name: 'Tue', occupancy: 72 },
  { name: 'Wed', occupancy: 78 },
  { name: 'Thu', occupancy: 90 },
  { name: 'Fri', occupancy: 95 },
  { name: 'Sat', occupancy: 65 },
  { name: 'Sun', occupancy: 45 },
];

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6b7280'];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { slots, bookings } = useParking();

  const stats = {
    available: slots.filter(s => s.status === 'available').length,
    occupied: slots.filter(s => s.status === 'occupied').length,
    reserved: slots.filter(s => s.status === 'reserved').length,
    maintenance: slots.filter(s => s.status === 'maintenance').length,
  };

  const totalSlots = slots.length;
  const occupancyRate = Math.round(((stats.occupied + stats.reserved) / totalSlots) * 100);
  const todayRevenue = bookings.reduce((sum, b) => b.paymentStatus === 'completed' ? sum + b.amount : sum, 0);

  const pieData = [
    { name: 'Available', value: stats.available },
    { name: 'Occupied', value: stats.occupied },
    { name: 'Reserved', value: stats.reserved },
    { name: 'Maintenance', value: stats.maintenance },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>System Online</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Slots</p>
                  <p className="text-3xl font-bold">{totalSlots}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <ParkingCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                  <p className="text-3xl font-bold">{occupancyRate}%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-3xl font-bold">KES {todayRevenue.toLocaleString()}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <CircleDollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold">{stats.occupied + stats.reserved}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-green-600" />
                Revenue Today (M-Pesa)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Occupancy Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Weekly Occupancy Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar 
                    dataKey="occupancy" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Slot Status & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Slot Status Pie */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Slot Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookings.slice(0, 5).map(booking => (
                  <div 
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                        {booking.slotNumber}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{booking.vehicleNumber}</p>
                        <p className="text-xs text-muted-foreground">{booking.duration}h parking</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-green-600">KES {booking.amount}</p>
                      <p className="text-xs text-muted-foreground capitalize">{booking.paymentStatus}</p>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No bookings yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
