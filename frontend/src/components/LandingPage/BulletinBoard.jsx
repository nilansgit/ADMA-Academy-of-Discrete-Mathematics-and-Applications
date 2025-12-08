export default function BulletinBoard() {
  const announcements = [
    {
      id: 1,
      title: "Call for Papers: IJDM Special Issue on Combinatorial Optimization",
      date: "08 Jan 2024",
      deadline: "Submission deadline extended to March 31, 2024"
    },
    {
      id: 2,
      title: "Call for Papers: IJDM Special Issue on Combinatorial Optimization",
      date: "08 Jan 2024",
      deadline: "Submission deadline extended to March 31, 2024"
    },
  ]

  return (
    <section className="w-full bg-beige-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-4xl font-bold text-gray-900">Bulletin Board</h2>
          
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{announcement.title}</h3>
                    <p className="mb-1 text-sm text-gray-500">{announcement.date}</p>
                    <p className="text-sm text-gray-600">{announcement.deadline}</p>
                  </div>
                  <button className="flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Show more
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-base font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              View all Announcements
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

