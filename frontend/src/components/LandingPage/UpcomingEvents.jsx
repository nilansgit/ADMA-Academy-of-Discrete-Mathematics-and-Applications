export default function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "International Conference on Discrete Mathematics",
      date: "15 Mar 2024",
      venue: "IIT Delhi",
      description: "Annual conference featuring latest research in discrete mathematics and applications"
    },
    {
      id: 2,
      title: "International Conference on Discrete Mathematics",
      date: "15 Mar 2024",
      venue: "IIT Delhi",
      description: "Annual conference featuring latest research in discrete mathematics and applications"
    },
    {
      id: 3,
      title: "International Conference on Discrete Mathematics",
      date: "15 Mar 2024",
      venue: "IIT Delhi",
      description: "Annual conference featuring latest research in discrete mathematics and applications"
    },
  ]

  return (
    <section className="w-full bg-gradient-to-b from-yellow-50 to-beige-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">Upcoming Events</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900">{event.title}</h3>
              <p className="mb-2 text-sm text-gray-600">Date: {event.date}</p>
              <p className="mb-3 text-sm text-gray-600">Venue: {event.venue}</p>
              <p className="mb-4 text-sm leading-relaxed text-gray-700">{event.description}</p>
              <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Learn more
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

