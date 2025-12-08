export default function OfficeBearers() {
  const bearers = [
    {
      id: 1,
      title: "President",
      name: "Dr. Ambat Vijayakumar",
      affiliation: "Cochin University of Science and Technology, Cochin",
      term: "Term: 2022-2025",
      email: "president@adma.org",
      avatar: "/president.png",
      textAlign: "left",
      avatarPosition: "left"
    },
    {
      id: 2,
      title: "Vice President",
      name: "Dr. Shyam S. Kamath",
      affiliation: "NITK Surathkal",
      term: "Term: 2022-2025",
      email: "president@adma.org",
      avatar: "/vice-president-avatar.png",
      textAlign: "right",
      avatarPosition: "left"
    },
  ]

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-4xl font-bold text-gray-900">Office Bearers</h2>
        
        <div className="space-y-6">
          {bearers.map((bearer) => (
            <div
              key={bearer.id}
              className={`relative flex items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white shadow-lg ${
                bearer.avatarPosition === 'left' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`relative z-10 ${bearer.avatarPosition === 'left' ? 'mr-8' : 'ml-8'}`}>
                <img
                  src={bearer.avatar}
                  alt={bearer.name}
                  className="h-48 w-auto object-contain"
                />
              </div>

              {/* Content */}
              <div className={`flex-1 ${bearer.textAlign === 'right' ? 'text-right' : 'text-left'}`}>
                <h3 className="mb-2 text-3xl font-bold">{bearer.title}</h3>
                <p className="mb-1 text-lg">{bearer.name}</p>
                <p className="mb-1 text-sm opacity-90">{bearer.affiliation}</p>
                <p className="mb-2 text-sm opacity-90">{bearer.term}</p>
                <a
                  href={`mailto:${bearer.email}`}
                  className="text-sm underline hover:opacity-80"
                >
                  {bearer.email}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-base font-medium text-white shadow hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            View All Past Executive Members
          </button>
        </div>
      </div>
    </section>
  )
}

