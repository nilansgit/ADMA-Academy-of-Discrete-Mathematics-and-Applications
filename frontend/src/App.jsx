import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage/LandingPage'
import Login from './components/MemberPage/Login'
import MembershipForm from './components/MemberPage/MembershipForm'
import EventsPage from './components/EventsPage/EventsPage'
import TreasurerDashboard from './components/Dashboard/TreasurerDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/membership/apply" element={<MembershipForm />} />
        <Route path="/dashboard/treasurer" element={<TreasurerDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
