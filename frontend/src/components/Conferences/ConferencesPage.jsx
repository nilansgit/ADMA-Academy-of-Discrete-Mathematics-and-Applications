import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";

const STRAPI_BASE_URL = "http://localhost:1337";

function ConferenceCard({ conference }) {
  const pdfUrl = conference.PDF?.url;
  const externalLink = conference.Link;
  const hasAction = !!(pdfUrl || externalLink);

  const handleOpenLink = () => {
    if (pdfUrl) {
      window.open(
        `${STRAPI_BASE_URL}${pdfUrl}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (externalLink) {
      window.open(externalLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpenLink}
      disabled={!hasAction}
      className="block w-full rounded-2xl border border-gray-200 px-4 py-3 text-left transition hover:border-blue-400 hover:bg-blue-50/60"
    >
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
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {conference.Description}
        </p>
      )}

      {hasAction && (
        <>
          <div className="mt-3 h-px w-full bg-gray-200" />
          <p className="mt-2 text-xs text-blue-600 underline">
            {conference.PDF
              ? "View detailed schedule (PDF)"
              : "View detailed schedule"}
          </p>
        </>
      )}
    </button>
  );
}

export default function ConferencesPage() {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/conferences?sort[0]=createdAt:desc&populate=PDF`
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

  const handleBecomeMember = () => navigate("/membership/apply");

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={handleBecomeMember} />
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
    </div>
  );
}
