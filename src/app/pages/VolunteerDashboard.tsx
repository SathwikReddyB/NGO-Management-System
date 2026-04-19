import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Heart, LogOut, Calendar, IndianRupee, Building2, Clock, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export function VolunteerDashboard() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [enrolledNgos, setEnrolledNgos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = sessionStorage.getItem('candidateId');
    const userType = sessionStorage.getItem('userType');
    
    if (!id || userType !== 'volunteer') {
      toast.error('Please login as a volunteer');
      navigate('/volunteer/login');
      return;
    }

    loadData(id);
  }, [navigate]);

  const loadData = async (id: string) => {
    setIsLoading(true);
    try {
      const [candidateData, enrollmentsData, bookingsData, ngosData] = await Promise.all([
        api.getCandidateById(id),
        api.getEnrollmentsByCandidate(id),
        api.getBookingsByCandidate(id),
        api.getNgos()
      ]);

      setCandidate(candidateData);
      setEnrollments(enrollmentsData);
      setBookings(bookingsData);

      // Get unique NGOs from enrollments / bookings by looking them up in allNgos
      const ngoIds = new Set([
        ...enrollmentsData.map((e: any) => e.ngoId),
        ...bookingsData.map((b: any) => b.ngoId)
      ]);
      const activeNgos = ngosData.filter((ngo: any) => ngoIds.has(ngo.id));
      setEnrolledNgos(activeNgos);
    } catch (err: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('candidateId');
    sessionStorage.removeItem('userType');
    toast.success('Logged out successfully');
    navigate('/');
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

  if (isLoading || !candidate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

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
              <span className="text-sm text-gray-600 hidden md:inline">Welcome, <span className="font-semibold">{candidate.name}</span></span>
              <Link to="/ngos">
                <Button variant="default" size="sm">
                  Browse NGOs
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
              <CardTitle className="text-sm font-medium">Enrolled NGOs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledNgos.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Organizations you support
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
                Total contributed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Volunteer Hours</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Slots booked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="enrolled" className="space-y-4">
          <TabsList>
            <TabsTrigger value="enrolled">My NGOs</TabsTrigger>
            <TabsTrigger value="donations">Donation History</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          {/* Enrolled NGOs Tab */}
          <TabsContent value="enrolled" className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">My Enrolled NGOs</h3>
              <p className="text-sm text-gray-600">Organizations you're supporting</p>
            </div>

            {enrolledNgos.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {enrolledNgos.map((ngo) => {
                  const ngoEnrollments = enrollments.filter(e => e.ngoId === ngo.id);
                  const ngoBookings = bookings.filter(b => b.ngoId === ngo.id);
                  const totalDonated = ngoEnrollments
                    .filter(e => e.serviceType === 'payment')
                    .reduce((sum, e) => sum + (e.amount || 0), 0);

                  return (
                    <Card key={ngo.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary">{ngo.category}</Badge>
                        </div>
                        <CardTitle className="text-xl">{ngo.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Donated:</span>
                            <span className="font-semibold">₹{totalDonated}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Volunteer Slots:</span>
                            <span className="font-semibold">{ngoBookings.length}</span>
                          </div>
                          <Link to={`/ngo/${ngo.id}`}>
                            <Button variant="outline" className="w-full mt-2">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 mb-4">You haven't enrolled in any NGOs yet</p>
                  <Button onClick={() => navigate('/ngos')}>
                    Browse NGOs
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Donation History Tab */}
          <TabsContent value="donations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>View all your contributions</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.filter(e => e.serviceType === 'payment').length > 0 ? (
                  <div className="space-y-4">
                    {enrollments
                      .filter(e => e.serviceType === 'payment')
                      .map((enrollment) => {
                        return (
                          <div key={enrollment.id} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                            <div>
                              <p className="font-semibold">{enrollment.ngoName}</p>
                              <p className="text-sm text-gray-600">
                                {formatDate(enrollment.date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">₹{enrollment.amount}</p>
                              <Badge variant="secondary">Donation</Badge>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">No donations made yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Volunteer Bookings</CardTitle>
                <CardDescription>View your scheduled volunteer activities</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      return (
                        <div key={booking.id} className="p-4 bg-secondary rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-lg">{booking.ngoName}</p>
                            </div>
                            <Badge>Confirmed</Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(booking.slotDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                            </div>
                            <p className="text-gray-700 mt-2">{booking.slotDescription}</p>
                          </div>
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
        </Tabs>
      </div>
    </div>
  );
}
