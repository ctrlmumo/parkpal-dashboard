import React, { useState } from 'react';
import { useParking, SlotStatus } from '@/contexts/ParkingContext';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Settings2, Car, CircleCheck, Clock, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<SlotStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  available: { label: 'Available', variant: 'default', icon: CircleCheck },
  occupied: { label: 'Occupied', variant: 'destructive', icon: Car },
  reserved: { label: 'Reserved', variant: 'secondary', icon: Clock },
  maintenance: { label: 'Maintenance', variant: 'outline', icon: Wrench },
};

const AdminSlotManagement: React.FC = () => {
  const { slots, updateSlotStatus } = useParking();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredSlots = slots.filter(slot => {
    const matchesSearch = slot.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || slot.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (slotId: string, newStatus: SlotStatus) => {
    updateSlotStatus(slotId, newStatus);
    toast({
      title: 'Slot Updated',
      description: `Slot status changed to ${newStatus}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Slot Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and override parking slot statuses
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by slot number or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Slots Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              All Parking Slots ({filteredSlots.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slot</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlots.map(slot => {
                    const config = statusConfig[slot.status];
                    const StatusIcon = config.icon;
                    
                    return (
                      <TableRow key={slot.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                              {slot.number}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>Section {slot.section}</TableCell>
                        <TableCell>
                          <Badge variant={config.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {slot.vehicleNumber || (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={slot.status}
                            onValueChange={(value) => handleStatusChange(slot.id, value as SlotStatus)}
                          >
                            <SelectTrigger className="w-36 ml-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="occupied">Occupied</SelectItem>
                              <SelectItem value="reserved">Reserved</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminSlotManagement;
