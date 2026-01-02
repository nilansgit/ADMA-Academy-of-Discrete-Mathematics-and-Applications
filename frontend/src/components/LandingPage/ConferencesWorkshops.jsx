import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { STRAPI_BASE_URL } from "../../constants";

export default function ConferencesWorkshops() {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);

  const LIMIT = 3;

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const query = `${STRAPI_BASE_URL}/api/conferences?sort[0]=createdAt:desc&pagination[limit]=${LIMIT}`;

        const response = await fetch(query);
        const result = await response.json();

        if (result.data) {
          setConferences(result.data);
        }
      } catch (error) {
        console.error("Error fetching conferences:", error);
      }
    };

    fetchConferences();
  }, []);

  const handleGoToConferences = () => {
    navigate("/conferences");
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left content */}
        <div>
          <h2 className="mb-6 text-4xl font-bold text-gray-900">
            Conferences & Workshops
          </h2>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-6">
              {conferences.length > 0 ? (
                conferences.map((conference) => (
                  <div key={conference.id}>
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <h4 className="text-lg font-bold text-gray-900">
                        {conference.Title}
                      </h4>
                      {conference.Date && (
                        <p className="text-sm font-medium text-blue-600 whitespace-nowrap">
                          {new Date(conference.Date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>
                    {conference.Description && (
                      <p className="text-sm text-gray-700">
                        {conference.Description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  No conferences available
                </p>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleGoToConferences}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                All Conferences
              </button>
            </div>
          </div>
        </div>

        {/* Right illustration */}
        <div className="relative">
          <img
            src="/man-chair.png"
            alt="Man in office chair"
            className="mx-auto max-h-[500px] w-auto object-contain"
          />
          <div className="pointer-events-none absolute -bottom-2 left-1/2 h-3 w-2/3 -translate-x-1/2 rounded-full bg-black/5 blur" />
        </div>
      </div>
    </section>
  );
}
