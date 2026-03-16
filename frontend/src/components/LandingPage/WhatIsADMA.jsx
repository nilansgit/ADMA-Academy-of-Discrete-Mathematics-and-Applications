import { useEffect, useState } from "react";
import { STRAPI_BASE_URL } from "../../constants";

export default function WhatIsADMA() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${STRAPI_BASE_URL}/api/about`);

        // unpublished
        if (!res.ok) {
          return;
        }

        const result = await res.json();
        setAbout(result.data);
      } catch (err) {
        console.error("Error fetching about:", err);
      }
    };

    fetchAbout();
  }, []);

  // if unpublished
  if (!about) return null;

  return (
    <section className="w-full bg-gradient-to-r from-yellow-50 via-white to-yellow-50 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="order-2 lg:order-1">
          <img
            src="/fivePeople.png"
            alt="Five professionals with books"
            className="mx-auto max-h-[400px] w-auto object-contain"
          />
        </div>

        <div className="order-1 lg:order-2">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900">{about.Title}</h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              {about.Description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
