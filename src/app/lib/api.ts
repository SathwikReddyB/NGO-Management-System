/// <reference types="vite/client" />
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

export const api = {
  // Auth
  registerNgo: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/register/ngo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  loginNgo: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/login/ngo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  registerCandidate: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/register/candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  loginCandidate: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/login/candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // NGOs
  getNgos: async () => {
    const res = await fetch(`${API_BASE}/ngos`);
    if (!res.ok) throw new Error('Failed to fetch NGOs');
    return res.json();
  },
  getNgoById: async (id: string) => {
    const res = await fetch(`${API_BASE}/ngos/${id}`);
    if (!res.ok) throw new Error('Failed to fetch NGO details');
    return res.json();
  },
  updateNgo: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/ngos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update NGO details');
    return res.json();
  },

  // Candidates
  getCandidateById: async (id: string) => {
    const res = await fetch(`${API_BASE}/candidates/${id}`);
    if (!res.ok) throw new Error('Failed to fetch candidate details');
    return res.json();
  },

  // Time Slots
  getSlotsByNgo: async (ngoId: string) => {
    const res = await fetch(`${API_BASE}/slots/ngo/${ngoId}`);
    if (!res.ok) throw new Error('Failed to fetch slots');
    return res.json();
  },
  addTimeSlot: async (data: any) => {
    const res = await fetch(`${API_BASE}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add slot');
    return res.json();
  },
  deleteTimeSlot: async (id: string) => {
    const res = await fetch(`${API_BASE}/slots/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete slot');
    return res.json();
  },

  // Bookings
  addBooking: async (data: any) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add booking');
    return res.json();
  },
  getBookingsByNgo: async (ngoId: string) => {
    const res = await fetch(`${API_BASE}/bookings/ngo/${ngoId}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },
  getBookingsByCandidate: async (candidateId: string) => {
    const res = await fetch(`${API_BASE}/bookings/candidate/${candidateId}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  // Enrollments
  addEnrollment: async (data: any) => {
    const res = await fetch(`${API_BASE}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add enrollment');
    return res.json();
  },
  getEnrollmentsByNgo: async (ngoId: string) => {
    const res = await fetch(`${API_BASE}/enrollments/ngo/${ngoId}`);
    if (!res.ok) throw new Error('Failed to fetch enrollments');
    return res.json();
  },
  getEnrollmentsByCandidate: async (candidateId: string) => {
    const res = await fetch(`${API_BASE}/enrollments/candidate/${candidateId}`);
    if (!res.ok) throw new Error('Failed to fetch enrollments');
    return res.json();
  },

  // Global Stats
  getGlobalStats: async () => {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch global stats');
    return res.json();
  },
};
