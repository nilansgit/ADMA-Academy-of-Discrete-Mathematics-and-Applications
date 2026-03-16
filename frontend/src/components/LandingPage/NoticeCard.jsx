import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { STRAPI_BASE_URL } from "../../constants";

export default function NoticeCard() {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/notice?populate=PDF&populate=Image`,
        );
        const result = await response.json();
        if (result.data) {
          setNotice(result.data);
        }
      } catch (error) {
        console.error("Error fetching notice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleShowMore = () => {
    if (notice.PDF?.url) {
      window.open(
        `${STRAPI_BASE_URL}${notice.PDF.url}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (notice.Link) {
      window.open(notice.Link, "_blank", "noopener,noreferrer");
    }
  };

  if (loading || !notice || !isVisible) {
    return null;
  }

  // Render as Pop-up Modal
  if (notice.Popup) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        onClick={handleClose}
      >
        <div
          className="relative mx-auto flex flex-col max-h-[90vh] w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute -right-2 -top-10 z-10 flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
            aria-label="Close notice"
          >
            <span className="text-xs font-bold uppercase tracking-widest">
              Close
            </span>
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Image */}
            {notice.Image && (
              <div className="flex-1 overflow-hidden bg-gray-100">
                <img
                  src={`${STRAPI_BASE_URL}${
                    notice.Image.formats?.small?.url || notice.Image.url
                  }`}
                  alt={notice.Title}
                  className="max-h-[60vh] w-full object-contain bg-gray-50"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5 sm:p-6 bg-white overflow-y-auto max-h-[35vh]">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                {notice.Title}
              </h3>

              {notice.Description && (
                <p className="mt-1.5 text-sm text-gray-600">
                  {notice.Description}
                </p>
              )}

              {(notice.PDF || notice.Link) && (
                <div className="mt-4 flex justify-start">
                  <button
                    onClick={handleShowMore}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-blue-600 transition-all"
                  >
                    Show more
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render as Banner
  return (
    <section className="w-full bg-gradient-to-r from-amber-50 to-amber-50 pt-8 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-start gap-4 rounded-2xl bg-white px-4 py-4 shadow-md ring-1 ring-black/5 sm:flex-row sm:items-start sm:gap-6 sm:px-6 sm:py-5">
          {/* Image */}
          {notice.Image && (
            <div className="flex-shrink-0 self-center sm:self-start">
              <img
                src={`${STRAPI_BASE_URL}${
                  notice.Image.formats?.thumbnail?.url || notice.Image.url
                }`}
                alt={notice.Title}
                className="h-22 w-22 rounded-lg object-cover shadow-sm sm:h-32 sm:w-32"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 pr-6 sm:pr-8">
            <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">
              {notice.Title}
            </h3>

            {notice.Description && (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {notice.Description}
              </p>
            )}

            {(notice.PDF || notice.Link) && (
              <div className="mt-3 sm:mt-4">
                <button
                  onClick={handleShowMore}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 transition sm:px-4 sm:text-sm"
                >
                  Show more
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            aria-label="Close notice"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
