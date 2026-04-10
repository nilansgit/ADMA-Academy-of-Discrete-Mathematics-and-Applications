import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";
import MembershipModal from "../MemberPage/MembershipModal";
import { useMembershipModal } from "../../hooks/useMembershipModal";
import { STRAPI_BASE_URL } from "../../constants";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function EventCard({ event }) {
  const pdfUrl = event.PDF?.url;
  const externalLink = event.Link;
  const hasAction = !!(pdfUrl || externalLink);
  const actionHref = pdfUrl ? `${STRAPI_BASE_URL}${pdfUrl}` : externalLink;

  return (
    <div className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-left">
      <div className="flex justify-between items-start gap-4">
        <p className="font-semibold text-gray-900 flex-1">{event.Title}</p>
        {event.Date && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md whitespace-nowrap">
            {new Date(event.Date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      {event.Description && (
        <div className="mt-2 text-sm text-gray-600">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {event.Description}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {hasAction && (
        <>
          <div className="mt-3 h-px w-full bg-gray-200" />
          <a
            href={actionHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-blue-600 underline"
          >
            {event.PDF ? "View details (PDF)" : "View details"}
          </a>
        </>
      )}
    </div>
  );
}

function EventSection({ title, events, handleClick }) {
  if (events.length === 0) {
    return (
      <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="mt-5 space-y-4">
          <p className="py-4 text-center text-gray-500">No events available</p>
        </div>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-blue-600"
          >
            See Archived Events
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-5 space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-blue-600"
        >
          See Archived Events
        </button>
      </div>
    </section>
  );
}

export default function EventsPage() {
  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal, handleApplyNow } =
    useMembershipModal();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/events?sort[0]=createdAt:desc&populate=PDF`,
        );
        const result = await response.json();

        if (result.data) {
          const upcoming = result.data.filter(
            (e) => e.Event_Status === "Upcoming",
          );
          const past = result.data.filter((e) => e.Event_Status === "Past");

          setUpcomingEvents(upcoming);
          setPastEvents(past);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleGoToArchives = () => {
    navigate("/events/archives");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={openModal} />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-0">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-500">
            Announcements
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Events & Updates
          </h1>
          <p className="mt-2 text-gray-600">
            Tap any event to open its detailed announcement
          </p>
        </header>

        <div className="space-y-10">
          <EventSection
            title="Up Next"
            events={upcomingEvents}
            handleClick={handleGoToArchives}
          />
          <EventSection
            title="Past Events"
            events={pastEvents}
            handleClick={handleGoToArchives}
          />
        </div>
      </main>
      <Footer />
      <MembershipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onApply={handleApplyNow}
      />
    </div>
  );
}
