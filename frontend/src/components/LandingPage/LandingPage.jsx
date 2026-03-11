import Navbar from "./Navbar";
import Hero from "./Hero";
import WhatIsADMA from "./WhatIsADMA";
import FoundingOfADMA from "./FoundingOfADMA";
import Publications from "./Publications";
import UpcomingEvents from "./UpcomingEvents";
import BulletinBoard from "./BulletinBoard";
import ConferencesWorkshops from "./ConferencesWorkshops";
import IJDMJournal from "./IJDMJournal";
import OfficeBearers from "./OfficeBearers";
import Footer from "./Footer";
import MembershipModal from "../MemberPage/MembershipModal";
import { useMembershipModal } from "../../hooks/useMembershipModal";
import { useState } from "react";

export default function LandingPage() {
  const { isModalOpen, openModal, closeModal, handleApplyNow } =
    useMembershipModal();
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(true);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Upgrade Notice Banner */}
      {showUpgradeNotice && (
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-orange-400 px-4 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <p className="text-sm sm:text-base font-semibold text-orange-900">
                Our website is currently undergoing upgrades. Membership
                registration will be available soon.
              </p>
            </div>
            <button
              onClick={() => setShowUpgradeNotice(false)}
              className="flex-shrink-0 text-orange-900 hover:text-orange-800 font-bold text-lg px-2 py-1"
              aria-label="Close notice"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <Navbar onBecomeMemberClick={openModal} />
      <Hero onRegisterNowClick={handleApplyNow} />
      <WhatIsADMA />
      <FoundingOfADMA />
      {/* <Publications /> */}
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
