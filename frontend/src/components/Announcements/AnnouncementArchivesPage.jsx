import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";

const STRAPI_BASE_URL = "http://localhost:1337";

function BulletinBoard({ announcements, handleClick }) {
  const handleShowMore = (announcement) => {
    const pdfUrl = announcement.PDF?.url;
    const externalLink = announcement.Link;

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
    <section className="rounded-3xl bg-white/90 p-6 shadow-lg">
      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {item.Title}
                </h3>

                {item.Date && (
                  <p className="mb-1 text-sm text-gray-500">
                    {new Date(item.Date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}

                {item.Description && (
                  <p className="text-sm text-gray-600">{item.Description}</p>
                )}
              </div>

              {(item.PDF || item.Link) && (
                <button
                  onClick={() => handleShowMore(item)}
                  className="w-full sm:w-auto flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Show more
                </button>
              )}
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <p className="py-4 text-center text-gray-500">
            No archived news available
          </p>
        )}
      </div>
    </section>
  );
}

export default function AnnouncementArchivesPage() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const BULLETIN_STATUS = "Archived";

  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        const query = `${STRAPI_BASE_URL}/api/bulletins?filters[Bulletin_Status][$eq]=${BULLETIN_STATUS}&sort[0]=createdAt:desc&populate=PDF`;

        const response = await fetch(query);
        const result = await response.json();

        if (result.data) {
          setAnnouncements(result.data);
        }
      } catch (error) {
        console.error("Error fetching bulletins:", error);
      }
    };

    fetchBulletins();
  }, []);

  const handleBecomeMember = () => {
    navigate("/membership/apply");
  };

  const handleGoToArchives = () => {
    navigate("/announcements/archives");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={handleBecomeMember} />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-0">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-500">
            Announcements
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Archived News
          </h1>
          <p className="mt-2 text-gray-600">
            Tap any event to open its detailed announcement.
          </p>
        </header>

        <BulletinBoard
          announcements={announcements}
          handleClick={handleGoToArchives}
        />
      </main>
      <Footer />
    </div>
  );
}
