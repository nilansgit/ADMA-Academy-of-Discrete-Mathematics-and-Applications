import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/MemberPage/Login";
import MembershipForm from "./components/MemberPage/MembershipForm";
import EventsPage from "./components/Events/EventsPage";
import EventArchivesPage from "./components/Events/EventArchivesPage";
import AnnouncementsPage from "./components/Announcements/AnnouncementsPage";
import AnnouncementArchivesPage from "./components/Announcements/AnnouncementArchivesPage";
import TreasurerDashboard from "./components/Dashboard/TreasurerDashboard";
import SecretaryDashboard from "./components/Dashboard/SecretaryDashboard";
import OfficeBearersPage from "./components/OfficeBearers/OfficeBearersPage";
import ConferencesPage from "./components/Conferences/ConferencesPage";
import GalleryPage from "./components/Gallery/GalleryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/events/archives" element={<EventArchivesPage />} />
        <Route path="/announcements/archives" element={<AnnouncementArchivesPage />} />
        <Route path="/office-bearers" element={<OfficeBearersPage />} />
        <Route path="/conferences" element={<ConferencesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/membership/apply" element={<MembershipForm />} />
        <Route path="/dashboard/treasurer" element={<TreasurerDashboard />} />
        <Route path="/dashboard/secretary" element={<SecretaryDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
