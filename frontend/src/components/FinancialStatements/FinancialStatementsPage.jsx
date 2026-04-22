import { useEffect, useState } from "react";
import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";
import MembershipModal from "../MemberPage/MembershipModal";
import { useMembershipModal } from "../../hooks/useMembershipModal";
import { STRAPI_BASE_URL } from "../../constants";

function StatementCard({ statement }) {
  const pdfUrl = statement.PDF?.url;

  const handleOpen = () => {
    if (!pdfUrl) {
      return;
    }

    window.open(`${STRAPI_BASE_URL}${pdfUrl}`, "_blank", "noopener,noreferrer");
  };

  const getYearLabel = () => {
    const startYear = statement.Start_Year;
    if (!startYear) {
      return "";
    }

    const endYear = statement.End_Year ?? startYear + 1;
    return `${startYear} -${endYear}`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/95 px-5 py-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
            Audited
          </span>
          <span className="text-base font-semibold text-gray-900">
            {getYearLabel()}
          </span>
        </div>

        {pdfUrl && (
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow hover:from-blue-700 hover:to-blue-600 sm:w-auto"
          >
            View PDF
          </button>
        )}
      </div>
    </div>
  );
}

export default function FinancialStatementsPage() {
  const { isModalOpen, openModal, closeModal, handleApplyNow } =
    useMembershipModal();
  const [statements, setStatements] = useState([]);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/financial-audited-statements?sort[0]=Start_Year:desc&populate=PDF`,
        );
        const result = await response.json();

        if (result?.data) {
          setStatements(result.data);
        }
      } catch (error) {
        console.error("Error fetching financial statements:", error);
      }
    };

    fetchStatements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={openModal} />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-0">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-500">
            Financial Statements
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Financial Audit Statements
          </h1>
          <p className="mt-2 text-gray-600">
            Browse the audited financial statements by year
          </p>
        </header>

        <section className="rounded-3xl bg-white/90 p-6 shadow-lg">
          <div className="space-y-4">
            {statements.map((statement) => (
              <StatementCard key={statement.id} statement={statement} />
            ))}
          </div>

          {statements.length === 0 && (
            <p className="py-4 text-center text-gray-500">
              No financial statements available.
            </p>
          )}
        </section>
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
