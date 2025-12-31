import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { STRAPI_BASE_URL } from "../../constants";

export default function BulletinBoard() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  const BULLETIN_STATUS = "Current";
  const LIMIT = 3;

  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        const query = `${STRAPI_BASE_URL}/api/bulletins?filters[Bulletin_Status][$eq]=${BULLETIN_STATUS}&sort[0]=createdAt:desc&pagination[limit]=${LIMIT}&populate=PDF`;

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

  const handleGoToAnnouncements = () => {
    navigate("/announcements");
  };

  return (
    <section className="w-full bg-beige-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-4xl font-bold text-gray-900">
            Bulletin Board
          </h2>

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
                      <p className="text-sm text-gray-600">
                        {item.Description}
                      </p>
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
                No current announcements available
              </p>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleGoToAnnouncements}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-base font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View all Announcements
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
