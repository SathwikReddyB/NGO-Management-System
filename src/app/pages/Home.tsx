import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Heart, Users, Building2, UserPlus, LogOut, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function Home() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeVolunteers: 0,
    registeredNgos: 0,
    fundsRaised: 0
  });

  useEffect(() => {
    setUserRole(sessionStorage.getItem('userType'));

    const fetchStats = async () => {
      try {
        const data = await api.getGlobalStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">NGO Connect</span>
          </div>
          <div className="flex items-center gap-3">
            {userRole === 'ngo' ? (
              <>
                <Link to="/ngo/dashboard">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => {
                  sessionStorage.clear();
                  setUserRole(null);
                  toast.success('Logged out successfully');
                }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : userRole === 'volunteer' ? (
              <>
                <Link to="/volunteer/dashboard">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => {
                  sessionStorage.clear();
                  setUserRole(null);
                  toast.success('Logged out successfully');
                }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/ngo/login">
                  <Button variant="outline" size="sm">NGO Login</Button>
                </Link>
                <Link to="/volunteer/login">
                  <Button variant="outline" size="sm">Volunteer Login</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Connect, Contribute, Change Lives
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Join our platform to make a difference. NGOs can register their organizations, 
          and volunteers can contribute through service or donations.
        </p>
        <div className="flex justify-center mt-8">
          <Link to="/ngos">
            <Button size="lg" className="px-8 py-6 text-lg">
              Browse All NGOs
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About NGO Connect</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Our mission is to bridge the gap between non-governmental organizations and passionate individuals who want to contribute. We believe in the power of community-driven change and aim to create a transparent, efficient ecosystem for social impact.
            </p>
            <p className="text-lg text-gray-500 mb-8">
              Whether you are an organization looking for dedicated volunteers, or an individual hoping to make a difference through your skills or donations, NGO Connect provides the tools you need to succeed.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 border-t">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 className="text-xl font-semibold mb-2">Register</h3>
            <p className="text-gray-600">Sign up as an NGO or volunteer candidate</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse & Connect</h3>
            <p className="text-gray-600">Explore NGOs and their causes</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Contribute</h3>
            <p className="text-gray-600">Donate funds or book volunteer slots</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="text-white py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stats.activeVolunteers}</div>
              <div className="text-white/90">Active Volunteers</div>
            </div>
            <div>
              <Building2 className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stats.registeredNgos}</div>
              <div className="text-white/90">Registered NGOs</div>
            </div>
            <div>
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">₹{stats.fundsRaised.toLocaleString()}</div>
              <div className="text-white/90">Funds Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-12">Join Our Platform</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* NGO Register Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-gray-100 text-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <CardTitle>Are you an NGO?</CardTitle>
              <CardDescription>
                Register your organization to manage volunteers and receive donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/ngo/register">
                <Button className="w-full" size="lg" variant="default">
                  Register as NGO
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Volunteer Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-gray-100 text-black rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8" />
              </div>
              <CardTitle>Want to help?</CardTitle>
              <CardDescription>
                Register as a volunteer and contribute your time or resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/candidate/register">
                <Button className="w-full" size="lg" variant="default">
                  Register as Volunteer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 NGO Connect. Making a difference together.</p>
        </div>
      </footer>
    </div>
  );
}