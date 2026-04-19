import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Heart, Users, MapPin, Mail, Phone, Globe, IndianRupee, Clock, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export function NgoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchNgoData() {
      setIsLoading(true);
      try {
        if (!id) return;
        const _ngo = await api.getNgoById(id);
        if (mounted) {
          setNgo(_ngo);
        }
      } catch (error) {
        if (mounted) {
          toast.error("Failed to load NGO Details.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchNgoData();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <Loader2 className="w-8 h-8 text-black animate-spin mb-4" />
        <p className="text-gray-600">Loading organization details...</p>
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

  const fundingProgress = ngo.fundingGoal > 0 
    ? Math.round((ngo.currentFunding / ngo.fundingGoal) * 100)
    : 0;

  const handleDonation = async () => {
    const amount = selectedAmount || parseInt(donationAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    // Check if candidate is logged in via token
    const candidateId = sessionStorage.getItem('candidateId');
    if (!candidateId) {
      toast.error('Please login as a volunteer to donate');
      navigate('/volunteer/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.addEnrollment({
        candidateId,
        ngoId: ngo.id,
        serviceType: 'payment',
        amount,
      });

      toast.success(`Thank you for your donation of ₹${amount}!`);
      setDonationAmount('');
      setSelectedAmount(null);
      
      // Refresh NGO data to get updated funding progress
      if (id) {
        const _ngo = await api.getNgoById(id);
        setNgo(_ngo);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to process donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVolunteer = () => {
    // Check if candidate is logged in via token
    const candidateId = sessionStorage.getItem('candidateId');
    if (!candidateId) {
      toast.error('Please login as a volunteer first');
      navigate('/volunteer/login');
      return;
    }

    navigate(`/ngo/${id}/volunteer`);
  };

  const quickAmounts = [25, 50, 100, 250];

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

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* NGO Header */}
            <Card className="overflow-hidden">
              {ngo.image && (
                <div className="w-full h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={ngo.image} 
                    alt={ngo.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {ngo.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{ngo.volunteers} Volunteers</span>
                  </div>
                </div>
                <CardTitle className="text-3xl">{ngo.name}</CardTitle>
                <CardDescription className="text-base mt-4">
                  {ngo.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span>{ngo.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <a href={`mailto:${ngo.email}`} className="hover:underline text-black">
                      {ngo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <a href={`tel:${ngo.phone}`} className="hover:underline text-black">
                      {ngo.phone}
                    </a>
                  </div>
                  {ngo.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <a href={`https://${ngo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-black">
                        {ngo.website}
                      </a>
                    </div>
                  )}
                </div>

                {ngo.fundingGoal > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Funding Progress</span>
                      <span className="font-bold text-black">{fundingProgress}%</span>
                    </div>
                    <Progress value={fundingProgress} className="h-3 mb-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="font-semibold">₹{ngo.currentFunding.toLocaleString()} raised</span>
                      <span>Goal: ₹{ngo.fundingGoal.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contribution Options */}
            <Card>
              <CardHeader>
                <CardTitle>How You Can Help</CardTitle>
                <CardDescription>Choose how you'd like to contribute to this cause</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="donate" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="donate">Make a Donation</TabsTrigger>
                    <TabsTrigger value="volunteer">Volunteer Your Time</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="donate" className="space-y-4 mt-4">
                    <div>
                      <Label className="mb-3 block">Select Amount</Label>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {quickAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={selectedAmount === amount ? "default" : "outline"}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setDonationAmount(amount.toString());
                            }}
                          >
                            ₹{amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="custom-amount"
                            type="number"
                            value={donationAmount}
                            onChange={(e) => {
                              setDonationAmount(e.target.value);
                              setSelectedAmount(null);
                            }}
                            placeholder="Enter amount"
                            className="pl-9"
                            min="1"
                          />
                        </div>
                        <Button onClick={handleDonation} disabled={isSubmitting} size="lg">
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Donate Now
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-4">
                      Your donation will directly support {ngo.name}'s mission and programs.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="volunteer" className="space-y-4 mt-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 border rounded-lg">
                      <Clock className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Volunteer Opportunities</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Book a time slot to volunteer with {ngo.name}. Your time and skills can make a real difference!
                        </p>
                        <Button onClick={handleVolunteer} variant="default">
                          View Available Slots
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Volunteers</span>
                  <span className="font-bold text-xl">{ngo.volunteers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Funds Raised</span>
                  <span className="font-bold text-xl">₹{ngo.currentFunding.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <Badge>{ngo.category}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Not Registered Yet?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Register as a volunteer to unlock all contribution features.
                </p>
                <Link to="/candidate/register">
                  <Button className="w-full" variant="default">
                    Register Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
