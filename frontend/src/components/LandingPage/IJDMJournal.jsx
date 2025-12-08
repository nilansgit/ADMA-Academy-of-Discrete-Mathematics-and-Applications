export default function IJDMJournal() {
  return (
    <section className="w-full bg-gradient-to-r from-yellow-50 to-white py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left illustration */}
        <div>
          <img
            src="/man-book.png"
            alt="Man holding book"
            className="mx-auto max-h-[500px] w-auto object-contain"
          />
        </div>

        {/* Right content card */}
        <div>
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">International Journal of Discrete Mathematics (IJDM)</h2>
            <h3 className="mt-4 text-xl font-bold text-gray-900">About the Journal</h3>
            <div className="mt-4 space-y-3 text-gray-700">
              <p>
                IJDM publishes high-quality research in discrete mathematics and its applications. We welcome original research articles, survey papers, and short communications covering all areas of discrete mathematics.
              </p>
              <p>
                The journal maintains rigorous peer-review standards and is indexed in major mathematical databases.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <button className="w-full rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Submit Manuscript
              </button>
              <button className="w-full rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Visit IJDM Website
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

