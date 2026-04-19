// Simple in-memory store for demo purposes
export interface NGO {
  id: string;
  name: string;
  description: string;
  category: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  image?: string;
  volunteers: number;
  fundingGoal: number;
  currentFunding: number;
  password: string; // For demo login
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  password: string; // For demo login
}

export interface Enrollment {
  id: string;
  candidateId: string;
  ngoId: string;
  serviceType: 'payment' | 'volunteer';
  amount?: number;
  date: string;
}

export interface TimeSlot {
  id: string;
  ngoId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  description: string;
}

export interface Booking {
  id: string;
  candidateId: string;
  slotId: string;
  ngoId: string;
  date: string;
}

class Store {
  private ngos: NGO[] = [
    {
      id: '1',
      name: 'Green Earth Foundation',
      description: 'Dedicated to environmental conservation and sustainable development. We work on reforestation, clean water initiatives, and climate change awareness.',
      category: 'Environment',
      email: 'contact@greenearth.org',
      phone: '+1-555-0101',
      address: '123 Eco Street, Green Valley, CA 94000',
      website: 'www.greenearth.org',
      volunteers: 234,
      fundingGoal: 50000,
      currentFunding: 32000,
      password: 'greenearth123', // For demo login
    },
    {
      id: '2',
      name: 'Education for All',
      description: 'Providing quality education to underprivileged children. We run schools, scholarship programs, and after-school tutoring.',
      category: 'Education',
      email: 'info@educationforall.org',
      phone: '+1-555-0102',
      address: '456 Learning Lane, Wisdom City, NY 10001',
      volunteers: 189,
      fundingGoal: 75000,
      currentFunding: 48000,
      password: 'educationforall123', // For demo login
    },
    {
      id: '3',
      name: 'Health First Initiative',
      description: 'Bringing healthcare to remote communities. We organize medical camps, provide free medicine, and health education.',
      category: 'Healthcare',
      email: 'support@healthfirst.org',
      phone: '+1-555-0103',
      address: '789 Wellness Way, Care Town, TX 75001',
      volunteers: 156,
      fundingGoal: 100000,
      currentFunding: 67000,
      password: 'healthfirst123', // For demo login
    },
  ];

  private candidates: Candidate[] = [];
  private enrollments: Enrollment[] = [];
  private timeSlots: TimeSlot[] = [
    {
      id: 's1',
      ngoId: '1',
      date: '2026-03-15',
      startTime: '09:00',
      endTime: '12:00',
      capacity: 10,
      booked: 3,
      description: 'Tree planting drive at Central Park',
    },
    {
      id: 's2',
      ngoId: '1',
      date: '2026-03-15',
      startTime: '14:00',
      endTime: '17:00',
      capacity: 10,
      booked: 5,
      description: 'Beach cleanup volunteer session',
    },
    {
      id: 's3',
      ngoId: '2',
      date: '2026-03-16',
      startTime: '10:00',
      endTime: '13:00',
      capacity: 15,
      booked: 8,
      description: 'Teaching assistance for elementary students',
    },
    {
      id: 's4',
      ngoId: '3',
      date: '2026-03-17',
      startTime: '08:00',
      endTime: '12:00',
      capacity: 20,
      booked: 12,
      description: 'Free health checkup camp',
    },
  ];
  private bookings: Booking[] = [];

  // NGO methods
  addNgo(ngo: Omit<NGO, 'id' | 'volunteers' | 'currentFunding'>) {
    const newNgo: NGO = {
      ...ngo,
      id: Date.now().toString(),
      volunteers: 0,
      currentFunding: 0,
    };
    this.ngos.push(newNgo);
    return newNgo;
  }

  getNgos() {
    return this.ngos;
  }

  getNgoById(id: string) {
    return this.ngos.find(ngo => ngo.id === id);
  }

  // Candidate methods
  addCandidate(candidate: Omit<Candidate, 'id'>) {
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now().toString(),
    };
    this.candidates.push(newCandidate);
    return newCandidate;
  }

  getCandidates() {
    return this.candidates;
  }

  // Enrollment methods
  addEnrollment(enrollment: Omit<Enrollment, 'id' | 'date'>) {
    const newEnrollment: Enrollment = {
      ...enrollment,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    this.enrollments.push(newEnrollment);
    
    // Update NGO funding if payment
    if (enrollment.serviceType === 'payment' && enrollment.amount) {
      const ngo = this.ngos.find(n => n.id === enrollment.ngoId);
      if (ngo) {
        ngo.currentFunding += enrollment.amount;
      }
    }
    
    return newEnrollment;
  }

  getEnrollmentsByNgo(ngoId: string) {
    return this.enrollments.filter(e => e.ngoId === ngoId);
  }

  // Time slot methods
  getTimeSlotsByNgo(ngoId: string) {
    return this.timeSlots.filter(slot => slot.ngoId === ngoId);
  }

  getTimeSlotById(id: string) {
    return this.timeSlots.find(slot => slot.id === id);
  }

  // Booking methods
  addBooking(booking: Omit<Booking, 'id' | 'date'>) {
    const slot = this.timeSlots.find(s => s.id === booking.slotId);
    if (!slot || slot.booked >= slot.capacity) {
      throw new Error('Slot is full or does not exist');
    }

    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    this.bookings.push(newBooking);
    slot.booked += 1;
    
    // Increment volunteer count
    const ngo = this.ngos.find(n => n.id === booking.ngoId);
    if (ngo) {
      ngo.volunteers += 1;
    }
    
    return newBooking;
  }

  getBookingsByCandidate(candidateId: string) {
    return this.bookings.filter(b => b.candidateId === candidateId);
  }

  getEnrollmentsByCandidate(candidateId: string) {
    return this.enrollments.filter(e => e.candidateId === candidateId);
  }

  getCandidateById(id: string) {
    return this.candidates.find(c => c.id === id);
  }

  // Authentication methods
  loginNgo(email: string, password: string) {
    return this.ngos.find(ngo => ngo.email === email && ngo.password === password);
  }

  loginCandidate(email: string, password: string) {
    return this.candidates.find(c => c.email === email && c.password === password);
  }

  // Add time slot for NGO
  addTimeSlot(slot: Omit<TimeSlot, 'id' | 'booked'>) {
    const newSlot: TimeSlot = {
      ...slot,
      id: 'slot-' + Date.now().toString(),
      booked: 0,
    };
    this.timeSlots.push(newSlot);
    return newSlot;
  }

  // Delete time slot
  deleteTimeSlot(id: string) {
    this.timeSlots = this.timeSlots.filter(s => s.id !== id);
  }

  // Get all bookings for an NGO
  getBookingsByNgo(ngoId: string) {
    return this.bookings.filter(b => b.ngoId === ngoId);
  }

  // Get all enrollments (for overview)
  getAllEnrollments() {
    return this.enrollments;
  }

  // Get all bookings
  getAllBookings() {
    return this.bookings;
  }
}

export const store = new Store();