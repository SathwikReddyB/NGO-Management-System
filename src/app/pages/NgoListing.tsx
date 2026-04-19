import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { ArrowLeft, Heart, Users, MapPin, Mail, Phone, Loader2, Search } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";
import React from "react";

export function NgoListing() {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const data = await api.getNgos();
        setNgos(data);
      } catch (err: any) {
        toast.error('Failed to load NGOs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNgos();
  }, []);

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

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse NGOs</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover organizations making a difference and choose how you want to contribute
          </p>

          <div className="max-w-2xl mx-auto relative relative flex items-center">
            <Search className="w-5 h-5 absolute left-3 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search NGOs by name, category, or description..." 
              className="pl-10 py-6 text-lg w-full rounded-full shadow-sm border-gray-200"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="ml-2 text-gray-600">Loading organizations...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.filter((ngo) => {
            const query = searchQuery.toLowerCase();
            return ngo.name?.toLowerCase().includes(query) || 
                   ngo.description?.toLowerCase().includes(query) || 
                   ngo.category?.toLowerCase().includes(query);
          }).map((ngo) => {
            const fundingProgress = ngo.fundingGoal > 0 
              ? Math.round((ngo.currentFunding / ngo.fundingGoal) * 100)
              : 0;

            return (
              <Card key={ngo.id} className="hover:shadow-xl transition-shadow flex flex-col">
                {ngo.image && (
                  <div className="w-full h-48 overflow-hidden rounded-t-xl group">
                    <img 
                      src={ngo.image} 
                      alt={ngo.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{ngo.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {ngo.volunteers}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{ngo.name}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {ngo.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{ngo.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{ngo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{ngo.phone}</span>
                    </div>
                  </div>

                  {ngo.fundingGoal > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Funding Progress</span>
                        <span className="font-semibold">{fundingProgress}%</span>
                      </div>
                      <Progress value={fundingProgress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>${ngo.currentFunding.toLocaleString()}</span>
                        <span>Goal: ${ngo.fundingGoal.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Link to={`/ngo/${ngo.id}`} className="w-full">
                    <Button className="w-full">
                      View Details & Contribute
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        )}

        {!isLoading && ngos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No NGOs registered yet.</p>
            <Link to="/ngo/register">
              <Button>Register Your NGO</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
