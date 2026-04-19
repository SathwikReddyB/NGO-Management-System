import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Heart, LogOut, IndianRupee, Users, Calendar, Plus, Trash2, Clock, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export function NgoDashboard() {
  const navigate = useNavigate();
  const [ngoId, setNgoId] = useState<string | null>(null);
  const [ngo, setNgo] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: '',
    capacity: '',
    description: '',
  });

  useEffect(() => {
    const id = sessionStorage.getItem('ngoId');
    const userType = sessionStorage.getItem('userType');
    
    if (!id || userType !== 'ngo') {
      toast.error('Please login as an NGO');
      navigate('/ngo/login');
      return;
    }

    setNgoId(id);
    loadData(id);
  }, [navigate]);

  const loadData = async (id: string) => {
    setIsLoading(true);
    try {
      const [ngoData, slotsData, enrollmentsData, bookingsData] = await Promise.all([
        api.getNgoById(id),
        api.getSlotsByNgo(id),
        api.getEnrollmentsByNgo(id),
        api.getBookingsByNgo(id)
      ]);
      setNgo(ngoData);
      setSlots(slotsData);
      setEnrollments(enrollmentsData);
      setBookings(bookingsData);
    } catch (err: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ngoId');
    sessionStorage.removeItem('userType');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngoId) return;

    try {
      await api.addTimeSlot({
        ngoId,
        date: newSlot.date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        capacity: parseInt(newSlot.capacity),
        description: newSlot.description,
      });

      toast.success('Time slot created successfully');
      setNewSlot({
        date: '',
        startTime: '',
        endTime: '',
        capacity: '',
        description: '',
      });
      setIsDialogOpen(false);
      loadData(ngoId);
    } catch (error) {
      toast.error('Failed to create time slot');
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!ngoId) return;
    
    try {
      await api.deleteTimeSlot(slotId);
      toast.success('Time slot deleted');
      loadData(ngoId);
    } catch (error) {
      toast.error('Failed to delete time slot');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading || !ngo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-black animate-spin mb-4" />
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  const fundingProgress = ngo.fundingGoal > 0 
    ? Math.round((ngo.currentFunding / ngo.fundingGoal) * 100)
    : 0;

  const totalDonations = enrollments
    .filter(e => e.serviceType === 'payment')
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-black" />
              <span className="text-2xl font-bold text-gray-900">NGO Connect</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:inline">Welcome, <span className="font-semibold">{ngo.name}</span></span>
              <Link to="/ngos">
                <Button variant="ghost" size="sm">
                  Browse NGOs
                </Button>
              </Link>
              <Link to={`/ngo/${ngo.id}`}>
                <Button variant="default" size="sm">
                  View Public Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ngo.volunteers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active volunteers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {enrollments.filter(e => e.serviceType === 'payment').length} donors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Slots</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{slots.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {bookings.length} bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Funding Progress */}
        {ngo.fundingGoal > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Funding Progress</CardTitle>
              <CardDescription>
                Track your fundraising goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">₹{ngo.currentFunding.toLocaleString()} raised</span>
                  <span className="text-gray-600">Goal: ₹{ngo.fundingGoal.toLocaleString()}</span>
                </div>
                <Progress value={fundingProgress} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {fundingProgress}% of goal reached
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="slots" className="space-y-4">
          <TabsList>
            <TabsTrigger value="slots">Time Slots</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="bookings">Volunteer Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="slots" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Manage Time Slots</h3>
                <p className="text-sm text-gray-600">Create and manage volunteer time slots</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Slot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Time Slot</DialogTitle>
                    <DialogDescription>
                      Add a new volunteer time slot for your organization
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateSlot} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newSlot.startTime}
                          onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newSlot.endTime}
                          onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={newSlot.capacity}
                        onChange={(e) => setNewSlot({ ...newSlot, capacity: e.target.value })}
                        placeholder="Number of volunteers needed"
                        min="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newSlot.description}
                        onChange={(e) => setNewSlot({ ...newSlot, description: e.target.value })}
                        placeholder="Describe the volunteer activity"
                        rows={3}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">Create Time Slot</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <Card key={slot.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{formatDate(slot.date)}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSlot(slot.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{slot.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{slot.booked} / {slot.capacity} volunteers</span>
                        </div>
                        <Badge variant={slot.booked >= slot.capacity ? "destructive" : "secondary"}>
                          {slot.booked >= slot.capacity ? 'Full' : 'Available'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-2">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-600">No time slots created yet. Create your first slot to get started!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>View all donations received</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.filter(e => e.serviceType === 'payment').length > 0 ? (
                  <div className="space-y-4">
                    {enrollments
                      .filter(e => e.serviceType === 'payment')
                      .map((enrollment) => (
                        <div key={enrollment.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                          <div>
                            <p className="font-semibold">₹{enrollment.amount}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(enrollment.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <Badge>Payment</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">No donations received yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Bookings</CardTitle>
                <CardDescription>View all volunteer slot bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      return (
                        <div key={booking.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                          <div>
                            <p className="font-semibold">
                              {booking.candidateName} <span className="text-sm font-normal text-muted-foreground mr-2">({booking.email})</span>
                              - {formatDate(booking.slotDate)} at {formatTime(booking.startTime)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Booked on {new Date(booking.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary">Confirmed</Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">No volunteer bookings yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Profile Settings Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Update your organization details and profile image</CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!ngoId) return;
                    try {
                      await api.updateNgo(ngoId, {
                        ...ngo,
                        fundingGoal: parseInt(ngo.fundingGoal) || 0
                      });
                      toast.success('Profile updated successfully');
                      loadData(ngoId);
                    } catch (err) {
                      toast.error('Failed to update profile');
                    }
                  }} 
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Organization Name</Label>
                      <Input
                        id="profile-name"
                        value={ngo.name}
                        onChange={(e) => setNgo({ ...ngo, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-category">Category</Label>
                      <Input
                        id="profile-category"
                        value={ngo.category}
                        onChange={(e) => setNgo({ ...ngo, category: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-description">Description</Label>
                    <Textarea
                      id="profile-description"
                      value={ngo.description}
                      onChange={(e) => setNgo({ ...ngo, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={ngo.email}
                        onChange={(e) => setNgo({ ...ngo, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-phone">Phone</Label>
                      <Input
                        id="profile-phone"
                        value={ngo.phone}
                        onChange={(e) => setNgo({ ...ngo, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-address">Address</Label>
                    <Input
                      id="profile-address"
                      value={ngo.address}
                      onChange={(e) => setNgo({ ...ngo, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-website">Website (Optional)</Label>
                      <Input
                        id="profile-website"
                        value={ngo.website || ''}
                        onChange={(e) => setNgo({ ...ngo, website: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-image">Profile Image URL (Optional)</Label>
                      <Input
                        id="profile-image"
                        value={ngo.image || ''}
                        onChange={(e) => setNgo({ ...ngo, image: e.target.value })}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-goal">Annual Funding Goal (₹)</Label>
                    <Input
                      id="profile-goal"
                      type="number"
                      value={ngo.fundingGoal}
                      onChange={(e) => setNgo({ ...ngo, fundingGoal: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">Save Profile Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
