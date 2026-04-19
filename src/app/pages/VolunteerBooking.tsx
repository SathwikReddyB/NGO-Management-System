import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Heart, Calendar, Clock, Users, CheckCircle, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export function VolunteerBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState<any>(null);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setIsLoading(true);
      try {
        if (!id) return;
        const [_ngo, _slots] = await Promise.all([
          api.getNgoById(id),
          api.getSlotsByNgo(id)
        ]);

        if (mounted) {
          setNgo(_ngo);
          setTimeSlots(_slots);
        }
      } catch (error) {
        if (mounted) {
          toast.error("Failed to load Volunteer Slots.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <Loader2 className="w-8 h-8 text-black animate-spin mb-4" />
        <p className="text-gray-600">Loading booking information...</p>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">NGO not found</h2>
          <Link to="/ngos">
            <Button>Back to NGO List</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = async (slotId: string) => {
    // Check if candidate is logged in via token
    const candidateId = sessionStorage.getItem('candidateId');
    if (!candidateId) {
      toast.error('Please login as a volunteer first');
      navigate('/volunteer/login');
      return;
    }

    setIsBooking(slotId);
    try {
      await api.addBooking({
        candidateId,
        slotId,
        ngoId: ngo.id,
      });

      toast.success('Volunteer slot booked successfully!');
      
      if (id) {
        const _slots = await api.getSlotsByNgo(id);
        setTimeSlots(_slots);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to book slot');
    } finally {
      setIsBooking(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
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

  // Group slots by date
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof timeSlots>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-black" />
            <span className="text-2xl font-bold text-gray-900">NGO Connect</span>
          </Link>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Volunteer Slot</h1>
          <p className="text-xl text-gray-600">
            Choose a time slot to volunteer with <span className="font-semibold">{ngo.name}</span>
          </p>
        </div>

        {/* Available Slots */}
        {Object.keys(slotsByDate).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(slotsByDate).map(([date, slots]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-black" />
                  <h2 className="text-2xl font-semibold">{formatDate(date)}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {(slots as any[]).map((slot: any) => {
                    const availableSpots = slot.capacity - slot.booked;
                    const isFull = availableSpots <= 0;
                    const fillPercentage = (slot.booked / slot.capacity) * 100;

                    return (
                      <Card 
                        key={slot.id} 
                        className={`${isFull ? 'opacity-60 bg-gray-50' : 'hover:shadow-lg'} transition-all`}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-black" />
                              <CardTitle className="text-lg">
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </CardTitle>
                            </div>
                            {isFull ? (
                              <Badge variant="destructive">Full</Badge>
                            ) : (
                              <Badge variant="secondary">
                                {availableSpots} spots left
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{slot.description}</CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>
                                  {slot.booked} / {slot.capacity} volunteers
                                </span>
                              </div>
                              <span className="font-semibold">
                                {Math.round(fillPercentage)}% filled
                              </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gray-800 h-2 rounded-full transition-all"
                                style={{ width: `${fillPercentage}%` }}
                              />
                            </div>

                            <Button 
                              className="w-full"
                              onClick={() => handleBooking(slot.id)}
                              disabled={isFull || isBooking === slot.id}
                            >
                              {isBooking === slot.id ? <Loader2 className="w-4 h-4 animate-spin" /> : isFull ? 'Slot Full' : 'Book This Slot'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">
                No volunteer slots available at the moment.
              </p>
              <Link to={`/ngo/${id}`}>
                <Button variant="outline">Back to NGO Details</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card className="mt-8 bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <CheckCircle className="w-5 h-5" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• Please arrive 10 minutes before your scheduled time</p>
            <p>• Bring a valid ID and any necessary equipment mentioned in the description</p>
            <p>• If you need to cancel, please inform the NGO at least 24 hours in advance</p>
            <p>• You will receive a confirmation email after booking</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
