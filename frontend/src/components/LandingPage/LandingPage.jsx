import Navbar from "./Navbar";
import Hero from "./Hero";
import WhatIsADMA from "./WhatIsADMA";
import Publications from "./Publications";
import UpcomingEvents from "./UpcomingEvents";
import BulletinBoard from "./BulletinBoard";
import ConferencesWorkshops from "./ConferencesWorkshops";
import IJDMJournal from "./IJDMJournal";
import OfficeBearers from "./OfficeBearers";
import Footer from "./Footer";
import MembershipModal from "../MemberPage/MembershipModal";
import { useMembershipModal } from "../../hooks/useMembershipModal";

export default function LandingPage() {
  const { isModalOpen, openModal, closeModal, handleApplyNow } =
    useMembershipModal();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar onBecomeMemberClick={openModal} />
      <Hero onRegisterNowClick={handleApplyNow} />
      <WhatIsADMA />
      <Publications />
      <UpcomingEvents />
      <BulletinBoard />
      <ConferencesWorkshops />
      <IJDMJournal />
      <OfficeBearers />
      <Footer />
      <MembershipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onApply={handleApplyNow}
      />
    </div>
  );
}
