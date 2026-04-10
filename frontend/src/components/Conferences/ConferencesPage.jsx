import { useState, useEffect } from "react";
import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";
import MembershipModal from "../MemberPage/MembershipModal";
import { useMembershipModal } from "../../hooks/useMembershipModal";
import { STRAPI_BASE_URL } from "../../constants";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function ConferenceCard({ conference }) {
  const pdfUrl = conference.PDF?.url;
  const externalLink = conference.Link;
  const hasAction = !!(pdfUrl || externalLink);
  const actionHref = pdfUrl ? `${STRAPI_BASE_URL}${pdfUrl}` : externalLink;

  return (
    <div className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-left">
      <div className="flex justify-between items-start gap-4">
        <p className="font-semibold text-gray-900 flex-1">{conference.Title}</p>
        {conference.Date && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md whitespace-nowrap">
            {new Date(conference.Date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      {conference.Description && (
        <div className="mt-2 text-sm text-gray-600">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {conference.Description}
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
            {conference.PDF ? "View details (PDF)" : "View details"}
          </a>
        </>
      )}
    </div>
  );
}

export default function ConferencesPage() {
  const { isModalOpen, openModal, closeModal, handleApplyNow } =
    useMembershipModal();
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/conferences?sort[0]=createdAt:desc&populate=PDF`,
        );

        const result = await response.json();
        if (result.data) {
          setConferences(result.data);
        }
      } catch (err) {
        console.error("Error fetching conferences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={openModal} />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-0">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-500">
            Academic Gatherings
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Conferences & Workshops
          </h1>
          <p className="mt-2 text-gray-600">
            Access detailed brochures and reports on conferences & workshops
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading conferences...
          </div>
        ) : (
          <div className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
            <div className="space-y-4">
              {conferences.length > 0 ? (
                conferences.map((conf) => (
                  <ConferenceCard key={conf.id} conference={conf} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">
                  No conferences found
                </p>
              )}
            </div>
          </div>
        )}
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
