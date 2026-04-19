import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { NgoRegistration } from "./pages/NgoRegistration";
import { CandidateRegistration } from "./pages/CandidateRegistration";
import { NgoListing } from "./pages/NgoListing";
import { NgoDetail } from "./pages/NgoDetail";
import { VolunteerBooking } from "./pages/VolunteerBooking";
import { NgoLogin } from "./pages/NgoLogin";
import { VolunteerLogin } from "./pages/VolunteerLogin";
import { NgoDashboard } from "./pages/NgoDashboard";
import { VolunteerDashboard } from "./pages/VolunteerDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/ngo/register",
    Component: NgoRegistration,
  },
  {
    path: "/ngo/login",
    Component: NgoLogin,
  },
  {
    path: "/ngo/dashboard",
    Component: NgoDashboard,
  },
  {
    path: "/candidate/register",
    Component: CandidateRegistration,
  },
  {
    path: "/volunteer/login",
    Component: VolunteerLogin,
  },
  {
    path: "/volunteer/dashboard",
    Component: VolunteerDashboard,
  },
  {
    path: "/ngos",
    Component: NgoListing,
  },
  {
    path: "/ngo/:id",
    Component: NgoDetail,
  },
  {
    path: "/ngo/:id/volunteer",
    Component: VolunteerBooking,
  },
]);