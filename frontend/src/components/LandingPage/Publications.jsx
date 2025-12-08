export default function Publications() {
  const publications = [
    { id: 1, title: "Topic Name", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor accumsan arcu, a maximus nulla feugiat vitae. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.", isActive: true },
    { id: 2, title: "Topic Name", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor accumsan arcu, a maximus nulla feugiat vitae. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.", isActive: false },
    { id: 3, title: "Topic Name", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor accumsan arcu, a maximus nulla feugiat vitae. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.", isActive: true },
    { id: 4, title: "Topic Name", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor accumsan arcu, a maximus nulla feugiat vitae. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.", isActive: true },
    { id: 5, title: "Topic Name", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor accumsan arcu, a maximus nulla feugiat vitae. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.", isActive: false },
  ]

  return (
    <section className="w-full bg-gradient-to-r from-yellow-50 to-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">Publications</h2>
        
        {/* Carousel container */}
        <div className="relative overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-hide">
            {publications.map((pub, index) => (
              <div
                key={pub.id}
                className={`flex-shrink-0 rounded-xl p-6 transition-all duration-300 {
                  pub.isActive
                    ? 'bg-white shadow-lg scale-105 opacity-100'
                    : 'bg-gray-100 shadow opacity-60 scale-95'
                }`}
                style={{ minWidth: '320px', maxWidth: '400px' }}
              >
                <h3 className={`mb-3 text-xl font-bold ${pub.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {pub.title}
                </h3>
                <p className={`text-sm leading-relaxed ${pub.isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                  {pub.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

