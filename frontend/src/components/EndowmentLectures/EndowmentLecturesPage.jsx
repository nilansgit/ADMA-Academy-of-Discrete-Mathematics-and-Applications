import { useEffect, useState } from "react";
import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";
import MembershipModal from "../MemberPage/MembershipModal";
import { useMembershipModal } from "../../hooks/useMembershipModal";
import { STRAPI_BASE_URL } from "../../constants";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function LectureCard({ lecture }) {
  const pdfUrl = lecture.PDF?.url;

  const handleOpen = () => {
    if (!pdfUrl) {
      return;
    }

    window.open(`${STRAPI_BASE_URL}${pdfUrl}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {lecture.Title}
          </h3>
          {pdfUrl && (
            <button
              type="button"
              onClick={handleOpen}
              className="w-full sm:w-auto flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View PDF
            </button>
          )}
        </div>

        {lecture.Description && (
          <div className="text-sm text-gray-600">
            <div className="mb-3 h-px w-full bg-gray-200" />
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {lecture.Description}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EndowmentLecturesPage() {
  const { isModalOpen, openModal, closeModal, handleApplyNow } =
    useMembershipModal();
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/endowment-lectures?sort[0]=createdAt:desc&populate=PDF`,
        );
        const result = await response.json();

        if (result?.data) {
          setLectures(result.data);
        }
      } catch (error) {
        console.error("Error fetching endowment lectures:", error);
      }
    };

    fetchLectures();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={openModal} />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-0">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-500">
            Endowment Lectures
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Endowment Lectures
          </h1>
          <p className="mt-2 text-gray-600">
            Explore past lectures and related documents
          </p>
        </header>

        <section className="rounded-3xl bg-white/90 p-6 shadow-lg">
          <div className="space-y-4">
            {lectures.map((lecture) => (
              <LectureCard key={lecture.id} lecture={lecture} />
            ))}
          </div>

          {lectures.length === 0 && (
            <p className="py-4 text-center text-gray-500">
              No endowment lectures available.
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
