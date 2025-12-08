import { useMemo, useState } from 'react'
import Navbar from '../LandingPage/Navbar'
import Footer from '../LandingPage/Footer'

const APPLICATIONS = [
  {
    id: 'ADMA-2025-0012',
    name: 'Dr. Sumit Rao',
    membershipType: 'Benefactor Life Member',
    amount: '₹10,000',
    submittedOn: '04 Jan 2025',
    affiliation: 'NITK Surathkal',
    phone: '+91 6350652711',
    email: 'sumit.24cvl503@nitk.edu.in',
    paymentReference: 'UPI-ADMA-982341',
    status: 'pending',
    citizenship: 'Indian',
    note: 'Awaiting payment verification',
    documents: {
      passportPhoto: '/placeholder-photo.png',
      paymentReceipt: '/dummy-event.pdf',
    },
  },
  {
    id: 'ADMA-2025-0003',
    name: 'Dr. Maya Roy',
    membershipType: 'Institutional Member',
    amount: '₹3,000',
    submittedOn: '29 Dec 2024',
    affiliation: 'Delhi Public University',
    phone: '+91 9824517710',
    email: 'maya.roy@dpu.edu',
    paymentReference: 'NEFT-98238921',
    status: 'forwarded',
    citizenship: 'Indian',
    note: 'Forwarded to Secretary on 02 Jan',
    documents: {
      passportPhoto: '/placeholder-photo.png',
      paymentReceipt: '/dummy-event.pdf',
    },
  },
  {
    id: 'ADMA-2024-0198',
    name: 'Prof. Andrew Cole',
    membershipType: 'Life Member (Individual)',
    amount: '$200',
    submittedOn: '13 Nov 2024',
    affiliation: 'University of Glasgow',
    phone: '+44 7123 888 222',
    email: 'andrew.cole@glasgow.ac.uk',
    paymentReference: 'SWIFT-ADMA-44221',
    status: 'approved',
    citizenship: 'International',
    note: 'Membership number generated: ADMA-LM-5521',
    documents: {
      passportPhoto: '/placeholder-photo.png',
      paymentReceipt: '/dummy-event.pdf',
    },
  },
  {
    id: 'ADMA-2025-0041',
    name: 'Ms. Aditi Krishnan',
    membershipType: 'Life Member (Individual)',
    amount: '₹2,000',
    submittedOn: '18 Jan 2025',
    affiliation: 'IISc Bangalore',
    phone: '+91 9012145678',
    email: 'aditi.k@iisc.ac.in',
    paymentReference: 'UPI-ADMA-884211',
    status: 'rejected',
    citizenship: 'Indian',
    note: 'Payment screenshot unclear. Asked to re-upload on 20 Jan',
    documents: {
      passportPhoto: '/placeholder-photo.png',
      paymentReceipt: '/dummy-event.pdf',
    },
  },
]

const STATUS_META = {
  all: { label: 'All', badge: 'bg-gray-100 text-gray-700' },
  pending: { label: 'Pending Verification', badge: 'bg-yellow-100 text-yellow-800' },
  forwarded: { label: 'Forwarded to Secretary', badge: 'bg-blue-100 text-blue-800' },
  approved: { label: 'Approved', badge: 'bg-green-100 text-green-800' },
  rejected: { label: 'Returned / Rejected', badge: 'bg-red-100 text-red-800' },
}

const ACTIONS = [
  { id: 'verify', label: 'Mark Payment Verified', style: 'from-green-500 to-green-600' },
  { id: 'forward', label: 'Forward to Secretary', style: 'from-blue-500 to-blue-600' },
  { id: 'reject', label: 'Return to Applicant', style: 'from-rose-500 to-rose-600' },
]

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <div className={`mt-4 h-1 rounded-full ${accent}`} />
    </div>
  )
}

function ApplicationCard({ application, onSelect }) {
  const meta = STATUS_META[application.status] || STATUS_META.pending
  return (
    <button
      type="button"
      onClick={() => onSelect(application)}
      className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-400 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{application.name}</p>
          <p className="text-xs text-gray-500">{application.membershipType}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}>{meta.label}</span>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-gray-800">Submitted:</span> {application.submittedOn}
        </p>
        <p>
          <span className="font-medium text-gray-800">Amount:</span> {application.amount}
        </p>
        <p>
          <span className="font-medium text-gray-800">Reference:</span> {application.paymentReference}
        </p>
        <p>
          <span className="font-medium text-gray-800">Affiliation:</span> {application.affiliation}
        </p>
      </div>
      <p className="mt-4 text-xs text-gray-500">{application.note}</p>
    </button>
  )
}

function DetailPanel({ application, remark, setRemark, onClose }) {
  if (!application) return null
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end bg-black/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-white px-6 py-6 shadow-2xl sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-500">Application</p>
            <h2 className="text-2xl font-bold text-gray-900">{application.id}</h2>
            <p className="text-sm text-gray-500">Submitted on {application.submittedOn}</p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900">
            Close ✕
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Applicant Info</h3>
            <div className="mt-3 grid gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-gray-800">Name:</span> {application.name}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Citizenship:</span> {application.citizenship}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Affiliation:</span> {application.affiliation}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Phone:</span> {application.phone}
              </p>
              <p className="sm:col-span-2">
                <span className="font-semibold text-gray-800">Email:</span> {application.email}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Payment Details</h3>
            <div className="mt-3 grid gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-gray-800">Membership Type:</span> {application.membershipType}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Amount:</span> {application.amount}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Transaction Ref:</span> {application.paymentReference}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Status:</span> {STATUS_META[application.status]?.label}
              </p>
              <div className="sm:col-span-2">
                <span className="font-semibold text-gray-800">Documents:</span>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a
                    href={application.documents.paymentReceipt}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Payment Receipt
                  </a>
                  <a
                    href={application.documents.passportPhoto}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Passport Photo
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Treasurer Remark</h3>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              placeholder="Eg: Payment verified via UPI. Forwarding to Secretary."
              className="mt-3 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </section>

          <section className="space-y-3">
            {ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => console.log(`${action.label} for`, application.id, 'remark:', remark)}
                className={`w-full rounded-2xl bg-gradient-to-r ${action.style} px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]`}
              >
                {action.label}
              </button>
            ))}
            <p className="text-xs text-gray-500">
              Actions will trigger notifications to the applicant and update workflow stages once the backend is connected.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function TreasurerDashboard() {
  const [filter, setFilter] = useState('pending')
  const [selected, setSelected] = useState(null)
  const [remark, setRemark] = useState('')

  const counts = useMemo(() => {
    return {
      total: APPLICATIONS.length,
      pending: APPLICATIONS.filter((app) => app.status === 'pending').length,
      forwarded: APPLICATIONS.filter((app) => app.status === 'forwarded').length,
      approved: APPLICATIONS.filter((app) => app.status === 'approved').length,
    }
  }, [])

  const filteredList = useMemo(() => {
    if (filter === 'all') return APPLICATIONS
    return APPLICATIONS.filter((app) => app.status === filter)
  }, [filter])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-yellow-500">Treasurer Workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Membership Verification Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Review payment evidence, update remarks and move applications through the workflow. Status changes will automatically inform applicants once
            backend integrations are connected.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Applications" value={counts.total} accent="bg-blue-500" />
          <StatCard label="Pending Verification" value={counts.pending} accent="bg-yellow-400" />
          <StatCard label="Forwarded to Secretary" value={counts.forwarded} accent="bg-indigo-400" />
          <StatCard label="Approved" value={counts.approved} accent="bg-green-500" />
        </section>

        <div className="mt-8 flex flex-wrap gap-3 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100">
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key)
                setSelected(null)
              }}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === key ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {meta.label}
            </button>
          ))}
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredList.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
              No applications found for this status.
            </div>
          ) : (
            filteredList.map((app) => <ApplicationCard key={app.id} application={app} onSelect={(data) => (setSelected(data), setRemark(''))} />)
          )}
        </section>
      </main>
      <Footer />
      {selected ? <DetailPanel application={selected} remark={remark} setRemark={setRemark} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}

