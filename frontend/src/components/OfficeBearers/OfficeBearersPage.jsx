import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";

const STRAPI_BASE_URL = "http://localhost:1337";

function MemberCard({ member }) {
  const imageUrl = member.Picture?.url
    ? `${STRAPI_BASE_URL}${member.Picture.url}`
    : null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 transition hover:border-blue-400 hover:bg-blue-50/40">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={member.Name}
          className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-1 ring-gray-100"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className="font-bold text-gray-900 text-sm leading-tight mb-0.5">
            {member.Name}
          </p>

          {member.Email && (
            <a
              href={`mailto:${member.Email}`}
              className="flex-shrink-0 text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded hover:bg-blue-100 transition-colors"
            >
              Email
            </a>
          )}
        </div>

        {member.University && (
          <p className="text-xs text-gray-500 italic leading-normal break-words">
            {member.University}
          </p>
        )}
      </div>
    </div>
  );
}

function TermSection({ termTitle, roles }) {
  return (
    <section className="rounded-2xl bg-white/90 p-5 shadow-md ring-1 ring-black/5 sm:p-6">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
        <div className="h-5 w-1 bg-blue-500 rounded-full" />
        <h2 className="text-lg font-bold text-gray-900">
          Office Bearers ({termTitle})
        </h2>
      </div>

      <div className="space-y-6">
        {Object.entries(roles).map(([roleTitle, members]) => (
          <div key={roleTitle} className="last:mb-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-2 opacity-80">
              {roleTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function OfficeBearersPage() {
  const navigate = useNavigate();
  const [groupedBearers, setGroupedBearers] = useState({});

  useEffect(() => {
    const fetchBearers = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/office-bearers?sort[0]=office_term.Start:desc&sort[1]=office_role.Order:asc&populate=Picture&populate=office_role&populate=office_term`
        );
        const result = await response.json();

        if (result.data) {
          const grouped = result.data.reduce((acc, item) => {
            const termTitle = item.office_term?.Title || "Other";
            const roleTitle = item.office_role?.Title || "Executive Member";

            if (!acc[termTitle]) acc[termTitle] = {};
            if (!acc[termTitle][roleTitle]) acc[termTitle][roleTitle] = [];

            acc[termTitle][roleTitle].push(item);
            return acc;
          }, {});

          setGroupedBearers(grouped);
        }
      } catch (error) {
        console.error("Error fetching office bearers:", error);
      }
    };

    fetchBearers();
  }, []);

  const handleBecomeMember = () => navigate("/membership/apply");

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={handleBecomeMember} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-500">
            Organization
          </p>
          <h1 className="mt-1 text-2xl font-black text-gray-900">
            Executive Committee
          </h1>
        </header>

        <div className="space-y-8">
          {Object.keys(groupedBearers).length > 0 ? (
            Object.entries(groupedBearers).map(([termTitle, roles]) => (
              <TermSection
                key={termTitle}
                termTitle={termTitle}
                roles={roles}
              />
            ))
          ) : (
            <div className="text-center py-20 animate-pulse text-gray-400 text-sm">
              Loading committee...
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
