import { useNavigate } from 'react-router-dom'
import Navbar from '../LandingPage/Navbar'
import Footer from '../LandingPage/Footer'

const upcomingEvents = [
  {
    id: 'up-1',
    title: 'Thirteen Lecture of ADMA Colloquium Lecture Series on 30th August 2025',
    speaker: 'Prof. Martin Milanič, University of Primorska in Koper, Slovenia',
    topic: 'Introduction to Tree-Independence Number',
    pdfUrl: '/dummy-event.pdf',
  },
  {
    id: 'up-2',
    title: 'Workshop on Discrete Structures and Graph Algorithms',
    speaker: 'Prof. Neha R., IISc Bangalore',
    topic: 'Advanced techniques for sparse graphs',
    pdfUrl: '/dummy-event.pdf',
  },
  {
    id: 'up-3',
    title: 'Mini Symposium on Combinatorics - September 2025',
    speaker: 'Multiple Speakers',
    topic: 'Enumerative combinatorics in practice',
    pdfUrl: '/dummy-event.pdf',
  },
]

const pastEvents = [
  {
    id: 'past-1',
    title: 'ADMA Summer School 2024',
    speaker: 'Dr. Shweta Menon, IIT Delhi',
    topic: 'Extremal graph theory primer',
    pdfUrl: '/dummy-event.pdf',
  },
  {
    id: 'past-2',
    title: 'Panel Discussion: Discrete Math for Data Science',
    speaker: 'Industry and Academia Panel',
    topic: 'Translating theory to products',
    pdfUrl: '/dummy-event.pdf',
  },
  {
    id: 'past-3',
    title: 'Colloquium Lecture Series, June 2024',
    speaker: 'Prof. Ajay Kulkarni, NITK',
    topic: 'Ramsey theory frontiers',
    pdfUrl: '/dummy-event.pdf',
  },
]

function EventCard({ event }) {
  const openPdf = () => {
    window.open(event.pdfUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={openPdf}
      className="block w-full rounded-2xl border border-gray-200 px-4 py-3 text-left transition hover:border-blue-400 hover:bg-blue-50/60"
    >
      <p className="font-semibold text-gray-900">{event.title}</p>
      <p className="mt-1 text-sm text-gray-600">{event.speaker}</p>
      <p className="mt-1 text-sm text-gray-500 italic">{event.topic}</p>
      <div className="mt-3 h-px w-full bg-gray-200" />
      <p className="mt-2 text-xs text-blue-600 underline">View detailed schedule (PDF)</p>
    </button>
  )
}

function EventSection({ title, events, actionText }) {
  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-5 space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-blue-600"
        >
          {actionText}
        </button>
      </div>
    </section>
  )
}

export default function EventsPage() {
  const navigate = useNavigate()

  const handleBecomeMember = () => {
    navigate('/membership/apply')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar onBecomeMemberClick={handleBecomeMember} />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-0">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-500">Announcements</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Events & Colloquium Updates</h1>
          <p className="mt-2 text-gray-600">
            Tap any event to open its detailed PDF announcement. Upcoming events are listed first, followed by highlights from recent editions.
          </p>
        </header>

        <div className="space-y-10">
          <EventSection title="Up Next" events={upcomingEvents} actionText="See All Upcoming Announcements" />
          <EventSection title="Past Events" events={pastEvents} actionText="See All Past Announcements" />
        </div>
      </main>
      <Footer />
    </div>
  )
}

