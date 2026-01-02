import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Hero from './Hero'
import WhatIsADMA from './WhatIsADMA'
import Publications from './Publications'
import UpcomingEvents from './UpcomingEvents'
import BulletinBoard from './BulletinBoard'
import ConferencesWorkshops from './ConferencesWorkshops'
import IJDMJournal from './IJDMJournal'
import OfficeBearers from './OfficeBearers'
import Footer from './Footer'
import MembershipModal from '../MemberPage/MembershipModal'

export default function LandingPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)


  const handleApplyNow = async() => {
    try{
      const res = await fetch("http://localhost:3000/forms",{method: "POST"});
      const {uuid} = await res.json();
      closeModal();
      navigate(`/membership/apply/${uuid}`);
    }catch(err){
      console.error("failed to start form", err);
    }
  }



  const goToMembershipForm = () => {
    handleApplyNow();
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar onBecomeMemberClick={openModal} />
      <Hero onRegisterNowClick={goToMembershipForm} />
      <WhatIsADMA />
      <Publications />
      <UpcomingEvents />
      <BulletinBoard />
      <ConferencesWorkshops />
      <IJDMJournal />
      <OfficeBearers />
      <Footer />
      <MembershipModal isOpen={isModalOpen} onClose={closeModal} onApply={goToMembershipForm} />
    </div>
  )
}

