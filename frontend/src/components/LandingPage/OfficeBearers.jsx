import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { STRAPI_BASE_URL } from "../../constants";

export default function OfficeBearers() {
  const navigate = useNavigate();
  const [bearers, setBearers] = useState([]);

  const handleGoToOfficeBearers = () => {
    navigate("/office-bearers");
  };

  useEffect(() => {
    const fetchBearers = async () => {
      try {
        // Linked office_term is active
        const query = `${STRAPI_BASE_URL}/api/office-bearers?filters[office_term][IsActive][$eq]=true&sort[0]=office_role.Order:asc&populate=Picture&populate=office_role&populate=office_term`;

        const response = await fetch(query);
        const result = await response.json();

        if (result.data) {
          setBearers(result.data);
        }
      } catch (error) {
        console.error("Error fetching office bearers:", error);
      }
    };

    fetchBearers();
  }, []);

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-4xl font-bold text-gray-900">
          Office Bearers
        </h2>

        <div className="space-y-6">
          {bearers.map((bearer, index) => {
            const isEven = index % 2 === 0;

            // Extract years from term
            const getTermYears = (term) => {
              if (!term) return "";
              const startYear = new Date(term.Start).getFullYear();
              const endYear = new Date(term.End).getFullYear();
              return `Term: ${startYear}-${endYear}`;
            };

            const data = {
              id: bearer.id,
              title: bearer.office_role?.Title || "",
              name: bearer.Name,
              affiliation: bearer.University || "",
              term: getTermYears(bearer.office_term),
              email: bearer.Email || "",
              avatar: bearer.Picture?.url
                ? `${STRAPI_BASE_URL}${bearer.Picture.url}`
                : null,
            };

            return (
              <div
                key={data.id}
                className={`relative flex flex-row items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-3 md:p-5 text-white shadow-lg gap-3 md:gap-8 ${
                  isEven ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Avatar */}
                {data.avatar && (
                  <div className="flex-shrink-0">
                    <img
                      src={data.avatar}
                      alt={data.name}
                      className="h-16 w-16 md:h-28 md:w-28 rounded-full md:rounded-lg object-cover bg-white/10 border-2 border-white/20"
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  className={`flex-1 min-w-0 ${
                    isEven ? "text-left" : "md:text-right"
                  }`}
                >
                  <h3 className="text-sm md:text-xl font-bold leading-tight">
                    {data.title}
                  </h3>

                  <p className="text-xs md:text-lg font-semibold opacity-95">
                    {data.name}
                  </p>

                  <div className="mt-0.5 space-y-0">
                    {data.affiliation && (
                      <p className="text-[10px] md:text-sm opacity-80 leading-tight">
                        {data.affiliation}
                      </p>
                    )}

                    {data.term && (
                      <p className="text-[10px] md:text-sm opacity-80 font-medium">
                        {data.term}
                      </p>
                    )}

                    {data.email && (
                      <a
                        href={`mailto:${data.email}`}
                        className="inline-block text-[10px] md:text-sm underline hover:text-blue-200 transition-colors break-all md:break-normal"
                      >
                        {data.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleGoToOfficeBearers}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-base font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View All Past Executive Members
          </button>
        </div>
      </div>
    </section>
  );
}
