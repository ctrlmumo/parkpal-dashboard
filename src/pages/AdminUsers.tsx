import React, { useState } from 'react';
import { useParking } from '@/contexts/ParkingContext';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, History, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

// Mock historical data
const mockHistory = [
  { id: '1', vehicleNumber: 'KAB 123X', slotNumber: 'A01', duration: 2, amount: 100, date: new Date(2024, 0, 15, 10, 30), status: 'completed' },
  { id: '2', vehicleNumber: 'KCA 456Y', slotNumber: 'B05', duration: 4, amount: 200, date: new Date(2024, 0, 15, 8, 0), status: 'completed' },
  { id: '3', vehicleNumber: 'KDB 789Z', slotNumber: 'C12', duration: 1, amount: 50, date: new Date(2024, 0, 14, 14, 15), status: 'completed' },
  { id: '4', vehicleNumber: 'KAA 111A', slotNumber: 'A08', duration: 6, amount: 300, date: new Date(2024, 0, 14, 9, 0), status: 'completed' },
  { id: '5', vehicleNumber: 'KBB 222B', slotNumber: 'D03', duration: 3, amount: 150, date: new Date(2024, 0, 13, 16, 45), status: 'completed' },
];

const AdminUsers: React.FC = () => {
  const { bookings, slots } = useParking();
  const [searchTerm, setSearchTerm] = useState('');

  const activeReservations = slots.filter(s => s.status === 'reserved' || s.status === 'occupied');

  const filteredActive = activeReservations.filter(slot =>
    slot.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = mockHistory.filter(item =>
    item.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.slotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              User Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor active reservations and user history
            </p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle number or slot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="gap-2">
              <Clock className="h-4 w-4" />
              Active ({filteredActive.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Active Reservations */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Active Reservations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Slot</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Section</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActive.map(slot => (
                        <TableRow key={slot.id}>
                          <TableCell>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                              {slot.number}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {slot.vehicleNumber || '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={slot.status === 'occupied' ? 'destructive' : 'secondary'}>
                              {slot.status === 'occupied' ? 'Parked' : 'Reserved'}
                            </Badge>
                          </TableCell>
                          <TableCell>Section {slot.section}</TableCell>
                        </TableRow>
                      ))}
                      {filteredActive.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No active reservations found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Booking History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Slot</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="text-muted-foreground">
                            {format(item.date, 'MMM d, yyyy h:mm a')}
                          </TableCell>
                          <TableCell>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                              {item.slotNumber}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.vehicleNumber}</TableCell>
                          <TableCell>{item.duration}h</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            KES {item.amount}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1 text-green-600 border-green-200 bg-green-50">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminUsers;
