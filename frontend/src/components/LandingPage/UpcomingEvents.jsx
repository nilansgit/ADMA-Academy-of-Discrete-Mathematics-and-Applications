import { useState, useEffect } from "react";
import { STRAPI_BASE_URL } from "../../constants";

export default function UpcomingEvents() {
  const EVENT_STATUS = "Upcoming";
  const LIMIT = 3;

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const query = `${STRAPI_BASE_URL}/api/events?filters[Event_Status][$eq]=${EVENT_STATUS}&sort[0]=createdAt:desc&pagination[limit]=${LIMIT}&populate=PDF`;

        const response = await fetch(query);
        const result = await response.json();

        if (result.data) {
          setEvents(result.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleLearnMore = (event) => {
    const pdfUrl = event.PDF?.url;
    const externalLink = event.Link;

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
    <section className="w-full bg-gradient-to-b from-yellow-50 to-beige-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
          Upcoming Events
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {item.Title}
                </h3>

                {item.Date && (
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(item.Date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}

                {item.Description && (
                  <p className="mb-4 text-sm leading-relaxed text-gray-700">
                    {item.Description}
                  </p>
                )}
              </div>

              {item.PDF || item.Link ? (
                <button
                  onClick={() => handleLearnMore(item)}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Learn more
                </button>
              ) : (
                <div className="h-10"></div>
              )}
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No upcoming events scheduled at this time.
          </p>
        )}
      </div>
    </section>
  );
}
