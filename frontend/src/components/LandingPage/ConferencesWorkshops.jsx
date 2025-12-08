export default function ConferencesWorkshops() {
  const conferences = [
    {
      id: 1,
      title: "ADMA International Conference 2024",
      dateLocation: "15-17 March 2024 • IIT Delhi",
      description: "Annual flagship conference featuring keynote speakers and research presentations"
    },
    {
      id: 2,
      title: "ADMA International Conference 2024",
      dateLocation: "15-17 March 2024 • IIT Delhi",
      description: "Annual flagship conference featuring keynote speakers and research presentations"
    },
  ]

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left content */}
        <div>
          <h2 className="mb-6 text-4xl font-bold text-gray-900">Conferences & Workshops</h2>
          
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Upcoming Conferences</h3>
            
            <div className="space-y-6">
              {conferences.map((conference) => (
                <div key={conference.id}>
                  <h4 className="mb-2 text-lg font-bold text-gray-900">{conference.title}</h4>
                  <p className="mb-2 text-sm text-gray-600">{conference.dateLocation}</p>
                  <p className="text-sm text-gray-700">{conference.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                All Conferences
              </button>
            </div>
          </div>
        </div>

        {/* Right illustration */}
        <div className="relative">
          <img
            src="/man-chair.png"
            alt="Man in office chair"
            className="mx-auto max-h-[500px] w-auto object-contain"
          />
          <div className="pointer-events-none absolute -bottom-2 left-1/2 h-3 w-2/3 -translate-x-1/2 rounded-full bg-black/5 blur" />
        </div>
      </div>
    </section>
  )
}

