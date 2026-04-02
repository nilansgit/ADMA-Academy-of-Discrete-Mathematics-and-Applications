import { useEffect, useState } from "react";
import { STRAPI_BASE_URL } from "../../constants";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function FoundingOfADMA() {
  const [founding, setFounding] = useState(null);

  useEffect(() => {
    const fetchFounding = async () => {
      try {
        const res = await fetch(`${STRAPI_BASE_URL}/api/founding`);

        // unpublished
        if (!res.ok) {
          return;
        }

        const result = await res.json();
        setFounding(result.data);
      } catch (err) {
        console.error("Error fetching founding:", err);
      }
    };

    fetchFounding();
  }, []);

  if (!founding) return null;

  return (
    <section className="w-full bg-gradient-to-r from-yellow-50 via-white to-yellow-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900">{founding.Title}</h2>
          <div className="mt-4 leading-relaxed text-gray-700">
            <div className="prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {founding.Description}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
