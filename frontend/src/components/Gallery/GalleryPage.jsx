import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";
import MembershipModal from "../MemberPage/MembershipModal";
import { useMembershipModal } from "../../hooks/useMembershipModal";
import { useState, useEffect } from "react";
import { X, Maximize } from "lucide-react";
import { STRAPI_BASE_URL } from "../../constants";

function ImageModal({ image, onClose }) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative mx-auto flex flex-col max-h-[90vh] w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -right-2 -top-10 z-10 flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
        >
          <span className="text-xs font-bold uppercase tracking-widest">
            Close
          </span>
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex-1 overflow-hidden bg-gray-100">
            <img
              src={`${STRAPI_BASE_URL}${image.Image.url}`}
              alt={image.Title}
              className="max-h-[60vh] w-full object-contain bg-gray-50"
            />
          </div>

          {(image.Title || image.Description) && (
            <div className="p-5 sm:p-6 bg-white overflow-y-auto max-h-[35vh]">
              {image.Title && (
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                  {image.Title}
                </h3>
              )}
              {image.Description && (
                <p className="mt-1.5 text-sm text-gray-600">
                  {image.Description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ image, onClick }) {
  return (
    <div
      onClick={() => onClick(image)}
      className="group relative mb-6 break-inside-avoid cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:ring-yellow-400/50"
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-yellow-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="bg-white/90 p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Maximize className="h-5 w-5 text-yellow-600" />
          </div>
        </div>

        <img
          src={`${STRAPI_BASE_URL}${
            image.Image.formats?.medium?.url || image.Image.url
          }`}
          alt={image.Title}
          className="h-full max-h-[400px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {(image.Title || image.Description) && (
        <div className="p-4">
          {image.Title && (
            <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
              {image.Title}
            </h3>
          )}
          {image.Description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {image.Description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const { isModalOpen, openModal, closeModal, handleApplyNow } =
    useMembershipModal();

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/gallery-images?populate=Image`,
        );

        const result = await response.json();
        if (result.data) {
          setImages(result.data);
        }
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={openModal} />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-0">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-500">
            Highlights
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Photo Gallery
          </h1>
          <p className="mt-2 text-gray-600">
            Click on the image to view its details
          </p>
        </header>

        <section>
          {loading ? (
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="mb-6 h-72 w-full animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          ) : images.length === 0 ? (
            <>
              <div className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
                <div className="space-y-4">
                  <p className="text-center text-gray-500 py-10">
                    No images found
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
              {images.map((image) => (
                <GalleryCard
                  key={image.id}
                  image={image}
                  onClick={setSelectedImage}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onApply={handleApplyNow}
      />
    </div>
  );
}
