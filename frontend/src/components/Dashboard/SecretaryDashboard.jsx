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
    forwardedOn: '06 Jan 2025',
    affiliation: 'NITK Surathkal',
    phone: '+91 6350652711',
    email: 'sumit.24cvl503@nitk.edu.in',
    paymentReference: 'UPI-ADMA-982341',
    status: 'pending',
    citizenship: 'Indian',
    note: 'Payment verified by Treasurer. Awaiting final approval.',
    documents: {
      passportPhoto: '/placeholder-photo.png',
      paymentReceipt: '/dummy-event.pdf',
    },
    fullDetails: {
      dob: '15 March 1985',
      qualification: 'Ph.D. in Discrete Mathematics',
      address: '123 Main Street, Surathkal, Karnataka - 575025',
      country: 'India',
    },
  },
  {
    id: 'ADMA-2025-0003',
    name: 'Dr. Maya Roy',
    membershipType: 'Institutional Member',
    amount: '₹3,000',
    submittedOn: '29 Dec 2024',
    forwardedOn: '02 Jan 2025',
    affiliation: 'Delhi Public University',
    phone: '+91 9824517710',
    email: 'maya.roy@dpu.edu',
    paymentReference: 'NEFT-98238921',
    status: 'onHold',
    citizenship: 'Indian',
    note: 'Institutional details need verification. Contacted on 05 Jan.',
    documents: {
      passportPhoto: '/placeholder-photo.png',
      paymentReceipt: '/dummy-event.pdf',
    },
    fullDetails: {
      dob: '22 July 1978',
      qualification: 'M.Sc., Ph.D.',
      address: '456 University Road, Delhi - 110001',
      country: 'India',
      representativeOne: 'Dr. Maya Roy',
      representativeTwo: 'Dr. Rajesh Kumar',
    },
  },
  {
    id: 'ADMA-2024-0198',
    name: 'Prof. Andrew Cole',
    membershipType: 'Life Member (Individual)',
    amount: '$200',
    submittedOn: '13 Nov 2024',
    forwardedOn: '18 Nov 2024',
    affiliation: 'University of Glasgow',
    phone: '+44 7123 888 222',
    email: 'andrew.cole@glasgow.ac.uk',
    paymentReference: 'SWIFT-ADMA-44221',
    status: 'approved',
    citizenship: 'International',
    membershipNumber: 'ADMA-LM-5521',
    note: 'Membership approved and card generated on 20 Nov 2024',
    documents: {
      passportPhoto: '/placeholder-photo.png',
      paymentReceipt: '/dummy-event.pdf',
    },
    fullDetails: {
      dob: '10 September 1975',
      qualification: 'Ph.D. in Combinatorics',
      address: '123 University Avenue, Glasgow, Scotland, UK - G12 8QQ',
      country: 'United Kingdom',
      passportNumber: 'UK123456789',
    },
  },
  {
    id: 'ADMA-2025-0045',
    name: 'Dr. Priya Sharma',
    membershipType: 'Patron Life Member',
    amount: '₹15,000',
    submittedOn: '20 Jan 2025',
    forwardedOn: '22 Jan 2025',
    affiliation: 'IIT Bombay',
    phone: '+91 9876543210',
    email: 'priya.sharma@iitb.ac.in',
    paymentReference: 'UPI-ADMA-991122',
    status: 'pending',
    citizenship: 'Indian',
    note: 'All details verified. Ready for approval.',
    documents: {
      passportPhoto: '/placeholder-photo.png',
      paymentReceipt: '/dummy-event.pdf',
    },
    fullDetails: {
      dob: '05 May 1980',
      qualification: 'Ph.D. in Graph Theory',
      address: '789 IIT Campus, Powai, Mumbai - 400076',
      country: 'India',
    },
  },
]

const STATUS_META = {
  all: { label: 'All', badge: 'bg-gray-100 text-gray-700' },
  pending: { label: 'Pending Review', badge: 'bg-yellow-100 text-yellow-800' },
  onHold: { label: 'On Hold', badge: 'bg-orange-100 text-orange-800' },
  approved: { label: 'Approved', badge: 'bg-green-100 text-green-800' },
  returned: { label: 'Returned for Edit', badge: 'bg-red-100 text-red-800' },
}

const ACTIONS = [
  { id: 'approve', label: 'Confirm Details & Generate Membership', style: 'from-green-500 to-green-600' },
  { id: 'hold', label: 'Put on Hold', style: 'from-orange-500 to-orange-600' },
  { id: 'return', label: 'Return for Edit', style: 'from-rose-500 to-rose-600' },
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

function ApplicationCard({ application, onClick }) {
  const statusMeta = STATUS_META[application.status] || STATUS_META.pending

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">{application.name}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusMeta.badge}`}>
              {statusMeta.label}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{application.membershipType}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <span>ID: {application.id}</span>
            <span>Amount: {application.amount}</span>
            <span>Forwarded: {application.forwardedOn}</span>
            <span>{application.citizenship}</span>
          </div>
          {application.membershipNumber && (
            <p className="mt-2 text-sm font-semibold text-green-600">
              Membership #: {application.membershipNumber}
            </p>
          )}
        </div>
      </div>
      {application.note && (
        <p className="mt-3 text-sm text-gray-600 italic">Note: {application.note}</p>
      )}
    </button>
  )
}

function DetailPanel({ application, onClose, onAction }) {
  const [remark, setRemark] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!application) return null

  const handleAction = async (actionId) => {
    if (actionId === 'hold' || actionId === 'return') {
      if (!remark.trim()) {
        alert('Please enter a remark explaining the reason.')
        return
      }
    }

    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      onAction(actionId, remark)
      alert(`Action "${ACTIONS.find((a) => a.id === actionId)?.label}" completed. ${actionId === 'approve' ? 'Membership card will be emailed to the applicant.' : 'Applicant will be notified.'}`)
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
          <p className="mt-1 text-sm text-gray-600">Application ID: {application.id}</p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">Full Name</dt>
                  <dd className="text-gray-600">{application.name}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Date of Birth</dt>
                  <dd className="text-gray-600">{application.fullDetails.dob}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Qualification</dt>
                  <dd className="text-gray-600">{application.fullDetails.qualification}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Current Affiliation</dt>
                  <dd className="text-gray-600">{application.affiliation}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Citizenship</dt>
                  <dd className="text-gray-600">{application.citizenship}</dd>
                </div>
                {application.fullDetails.passportNumber && (
                  <div>
                    <dt className="font-medium text-gray-700">Passport Number</dt>
                    <dd className="text-gray-600">{application.fullDetails.passportNumber}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">Email</dt>
                  <dd className="text-gray-600">{application.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Phone</dt>
                  <dd className="text-gray-600">{application.phone}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Address</dt>
                  <dd className="text-gray-600">{application.fullDetails.address}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Country</dt>
                  <dd className="text-gray-600">{application.fullDetails.country}</dd>
                </div>
              </dl>
            </div>
          </div>

          {application.fullDetails.representativeOne && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">Institutional Representatives</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">Representative 1</dt>
                  <dd className="text-gray-600">{application.fullDetails.representativeOne}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Representative 2</dt>
                  <dd className="text-gray-600">{application.fullDetails.representativeTwo}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900">Membership & Payment</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-700">Membership Type</dt>
                <dd className="text-gray-600">{application.membershipType}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Amount</dt>
                <dd className="text-gray-600">{application.amount}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Payment Reference</dt>
                <dd className="text-gray-600">{application.paymentReference}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Submitted On</dt>
                <dd className="text-gray-600">{application.submittedOn}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Forwarded On</dt>
                <dd className="text-gray-600">{application.forwardedOn}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            <div className="mt-4 flex gap-4">
              <a
                href={application.documents.passportPhoto}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                View Passport Photo
              </a>
              <a
                href={application.documents.paymentReceipt}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                View Payment Receipt
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-900">
              Remarks / Notes
              <span className="ml-2 text-xs font-normal text-gray-500">
                (Required for "Put on Hold" or "Return for Edit")
              </span>
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter remarks or reason for action..."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={isProcessing}
                className={`rounded-xl bg-gradient-to-r ${action.style} px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isProcessing ? 'Processing...' : action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SecretaryDashboard() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState(null)

  const filteredApplications = useMemo(() => {
    if (selectedStatus === 'all') return APPLICATIONS
    return APPLICATIONS.filter((app) => app.status === selectedStatus)
  }, [selectedStatus])

  const stats = useMemo(() => {
    return {
      total: APPLICATIONS.length,
      pending: APPLICATIONS.filter((a) => a.status === 'pending').length,
      onHold: APPLICATIONS.filter((a) => a.status === 'onHold').length,
      approved: APPLICATIONS.filter((a) => a.status === 'approved').length,
    }
  }, [])

  const handleAction = (actionId, remark) => {
    console.log('Secretary action:', { actionId, remark, applicationId: selectedApplication?.id })
    // TODO: API call to update application status
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secretary Dashboard</h1>
          <p className="mt-2 text-gray-600">Review and approve membership applications forwarded by Treasurer</p>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Applications" value={stats.total} accent="bg-blue-500" />
          <StatCard label="Pending Review" value={stats.pending} accent="bg-yellow-500" />
          <StatCard label="On Hold" value={stats.onHold} accent="bg-orange-500" />
          <StatCard label="Approved" value={stats.approved} accent="bg-green-500" />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setSelectedStatus(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedStatus === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
              }`}
            >
              {meta.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">No applications found for this status.</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onClick={() => setSelectedApplication(application)}
              />
            ))
          )}
        </div>
      </main>
      <Footer />

      {selectedApplication && (
        <DetailPanel
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}

