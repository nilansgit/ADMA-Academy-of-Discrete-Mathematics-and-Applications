import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthData } from '../../utils/tokenUtils'


const STATUS_META = {
  all: { label: 'All', badge: 'bg-gray-100 text-gray-700' },
  FORWARDED_TO_TREASURER: { label: 'Pending Verification', badge: 'bg-yellow-100 text-yellow-800' },
  FORWARDED_TO_SECRETARY: { label: 'Forwarded to Secretary', badge: 'bg-blue-100 text-blue-800' },
  TREASURER_REJECTED: { label: 'Returned / Rejected', badge: 'bg-red-100 text-red-800' },
}

const ACTIONS = [
  { id: 'forward', label: 'Forward to Secretary', style: 'from-blue-500 to-blue-600' },
  { id: 'reject', label: 'Return to Applicant', style: 'from-rose-500 to-rose-600' },
]

const BACKEND_URL  = import.meta.env.VITE_BACKEND_URL

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <div className={`mt-4 h-1 rounded-full ${accent}`} />
    </div>
  )
}

function ApplicationRow({ application, onSelect }) {
  const submittedDate = application.updated_at || application.created_at || application.Submitted || application.submittedOn;
  const formattedDate = submittedDate ? new Date(submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  // Get currency and amount from application data
  const getFormattedAmount = () => {
    if (application.Amount) {
      // If Amount already includes currency, return as is
      if (typeof application.Amount === 'string' && (application.Amount.includes('₹') || application.Amount.includes('$') || application.Amount.includes('USD') || application.Amount.includes('INR'))) {
        return application.Amount;
      }
    }
    
    // Try to parse data to get currency
    let formData = null;
    try {
      formData = typeof application.data === "string" ? JSON.parse(application.data) : application.data;
    } catch (e) {
      formData = application.data || {};
    }
    
    // Determine currency based on multiple checks:
    // 1. Check citizenship field
    // 2. Check membershipType.id for '_foreign' suffix
    // 3. Check membershipType.currency
    let currency = 'INR'; // default
    
    if (formData?.citizenship === 'foreign') {
      currency = 'USD';
    } else if (formData?.citizenship === 'indian') {
      currency = 'INR';
    } else if (formData?.membershipType?.id && formData.membershipType.id.includes('_foreign')) {
      // Check if membership type ID contains '_foreign' (e.g., 'patron_foreign')
      currency = 'USD';
    } else if (formData?.membershipType?.currency) {
      currency = formData.membershipType.currency;
    }
    
    const fee = formData?.membershipType?.fee || application.Amount || 0;
    
    // Map currency codes to symbols
    const currencySymbol = currency === 'USD' ? '$' : '₹';
    
    return `${currencySymbol}${typeof fee === 'number' ? fee.toLocaleString() : fee}`;
  };

  const formattedAmount = getFormattedAmount();

  return (
    <button
      type="button"
      onClick={() => onSelect(application)}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-sm last:rounded-b-lg"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5 items-center">
        <div className="md:col-span-1 text-sm text-gray-600">
          <span className="md:font-normal font-mono text-sm">{application.application_number}</span>
        </div>
        <div className="md:col-span-1">
          <p className="text-sm font-semibold text-gray-900">{application.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{application.membershipType || 'N/A'}</p>
        </div>
        <div className="md:col-span-1 text-sm text-gray-600">
          <span className="font-medium text-gray-800 hidden md:inline">Date: </span>
          <span className="md:font-normal">{formattedDate}</span>
        </div>
        <div className="md:col-span-1 text-sm text-gray-600">
          <span className="font-medium text-gray-800 hidden md:inline">Amount: </span>
          <span className="md:font-normal">{formattedAmount || 'N/A'}</span>
        </div>
        <div className="md:col-span-1 text-sm text-gray-600">
          <span className="font-medium text-gray-800 hidden md:inline">Ref: </span>
          <span className="md:font-normal">{application.paymentReference || 'N/A'}</span>
        </div>
      </div>
    </button>
  )
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, confirmStyle }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 ${confirmStyle}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ application, remark, setRemark, onClose, isLoading, onActionComplete }) {
  const navigate = useNavigate();
  const [remarkError, setRemarkError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  if (!application) return null;

  // Parse the data field
  let applicationData = null;
  try {
    applicationData =
      typeof application.data === "string"
        ? JSON.parse(application.data)
        : application.data;
  } catch (e) {
    console.error("Failed to parse form data:", e);
    applicationData = application.data || {};
  }

  const handleAction = async (actionId) => {
    if (actionId === "reject") {
      // Check if remark is filled
      if (!remark.trim()) {
        setRemarkError(
          "Treasurer remark is required before returning to applicant"
        );
        return;
      }
      setRemarkError("");
      // Show confirmation for reject
      setPendingAction(actionId);
      setShowConfirmModal(true);
    } else if (actionId === "forward") {
      // Show confirmation for forward
      setPendingAction(actionId);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    try {
      const url = new URL(
        `${BACKEND_URL}/treasurer/${application.uuid}/${pendingAction}`,window.location.origin
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: window.localStorage.getItem("token"),
        },
        body: JSON.stringify({ reason: remark }),
      });

      if (!response.ok) throw new Error("Action failed");

      setShowConfirmModal(false);
      setPendingAction(null);

      // Refresh list and counts first so UI updates instantly when panel closes
      if (onActionComplete) {
        await onActionComplete();
      }
      onClose();
      navigate("/dashboard/treasurer", { replace: true });
    } catch (err) {
      console.error("Failed to process action:", err);
      alert("Failed to process the action. Please try again.");
      setShowConfirmModal(false);
      setPendingAction(null);

      // Still refresh so UI stays in sync (e.g. if backend updated)
      if (onActionComplete) {
        await onActionComplete();
      }
      onClose();
      navigate("/dashboard/treasurer", { replace: true });
    }
  };

  const getConfirmModalProps = () => {
    if (pendingAction === "forward") {
      return {
        title: "Confirm Forward to Secretary",
        message: "Have you verified the payment details? Please confirm that payment verification is complete before forwarding to the Secretary.",
        confirmText: "Yes, Forward",
        confirmStyle: "bg-gradient-to-r from-blue-500 to-blue-600",
      };
    } else if (pendingAction === "reject") {
      return {
        title: "Confirm Return to Applicant",
        message: `Are you sure you want to return this application to the applicant? The following remark will be sent: "${remark}"`,
        confirmText: "Yes, Return",
        confirmStyle: "bg-gradient-to-r from-rose-500 to-rose-600",
      };
    }
    return null;
  };

  const formData = applicationData || {};

  const InfoSection = ({ title, children, className = "" }) => (
    <div
      className={`rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-6 ${className}`}
    >
      <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
        {title}
      </h3>
      <dl className="mt-4 space-y-3">{children}</dl>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="flex justify-between gap-7 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <dt className="text-sm font-medium text-gray-600 flex-shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-gray-900 font-medium text-right flex-1">
        {value || "N/A"}
      </dd>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition hover:scale-110"
          aria-label="Close"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {isLoading && (
          <div className="mt-6 flex items-center justify-center py-12">
            <div className="text-sm text-gray-500">
              Loading application details...
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Application Details
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">
                    {application.application_number || application.uuid}
                  </span>
                </p>
              </div>
            </div>

            {/* Applicant (name, email, phone only) */}
            <div className="mt-8">
              <InfoSection title="Applicant">
                <InfoItem label="Name" value={application.name || formData.name} />
                <InfoItem
                  label="Email"
                  value={application.email || formData.email}
                />
                <InfoItem
                  label="Phone"
                  value={`${formData.phoneCode || ''} ${formData.phoneNumber || ''}`.trim() || 'N/A'}
                />
              </InfoSection>
            </div>

            {/* Payment & related details only */}
            <div className="mt-6">
              <InfoSection title="Payment & Related">
                <InfoItem
                  label="Membership Type"
                  value={formData.membershipType?.title}
                />
                <InfoItem
                  label="Amount"
                  value={(() => {
                    let currency = 'INR';
                    if (formData.citizenship === 'foreign') currency = 'USD';
                    else if (formData.citizenship === 'indian') currency = 'INR';
                    else if (formData.membershipType?.id && formData.membershipType.id.includes('_foreign')) currency = 'USD';
                    else if (formData.membershipType?.currency) currency = formData.membershipType.currency;
                    const symbol = currency === 'USD' ? '$' : '₹';
                    const fee = formData.membershipType?.fee || 0;
                    return `${symbol}${typeof fee === 'number' ? fee.toLocaleString() : fee}`;
                  })()}
                />
                <InfoItem
                  label="Payment Reference"
                  value={formData.paymentReference || application.paymentReference}
                />
                <InfoItem
                  label="Created at"
                  value={
                    application.created_at
                      ? new Date(application.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"
                  }
                />
                <InfoItem
                  label="Last submitted at"
                  value={
                    application.updated_at
                      ? new Date(application.updated_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"
                  }
                />
              </InfoSection>
            </div>

            {/* Payment receipt document */}
            {formData.paymentReceipt && (
              <div className="mt-6">
                <InfoSection title="Receipt">
                  <div className="pt-2 flex gap-3 flex-wrap">
                    <a
                      href={`${BACKEND_URL}/membership/${application.uuid}/paymentReceipt`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition border border-green-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Payment Receipt
                    </a>
                  </div>
                </InfoSection>
              </div>
            )}

            {/* Applicant notes (payment/application related) */}
            {formData.notes && formData.notes.trim() && (
              <div className="mt-6">
                <InfoSection title="Applicant Notes">
                  <div className="pt-2">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.notes}</p>
                  </div>
                </InfoSection>
              </div>
            )}

            {/* Remarks Section */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50/50 to-white p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Treasurer Remarks / Notes
                <span className="ml-2 text-xs font-normal text-gray-500">
                  (Required for returning to applicant)
                </span>
              </label>
              <textarea
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value);
                  if (remarkError && e.target.value.trim()) {
                    setRemarkError("");
                  }
                }}
                rows={4}
                placeholder="Eg: Payment verified via UPI. Forwarding to Secretary."
                className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  remarkError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {remarkError && (
                <p className="mt-2 text-xs text-red-600">{remarkError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Required for all actions. This remark will be visible to the
                applicant.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3 pb-2">
              {ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  disabled={
                    (action.id === "reject" &&
                      (!remark.trim() ||
                        application.status !== "FORWARDED_TO_TREASURER")) ||
                    (action.id === "forward" &&
                      application.status !== "FORWARDED_TO_TREASURER")
                  }
                  className={`rounded-xl bg-gradient-to-r ${action.style} px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingAction(null);
        }}
        onConfirm={handleConfirmAction}
        {...getConfirmModalProps()}
      />
    </div>
  );
}


export default function TreasurerDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('FORWARDED_TO_TREASURER')
  const [selected, setSelected] = useState(null)
  const [remark, setRemark] = useState("")
  const [formsCount, setFormsCount] = useState({});
  const [formsDetail,setFormsDetail] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [dateSort, setDateSort] = useState('desc'); // 'asc' or 'desc'

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  const filteredList = useMemo(() => {
    let list = filter === 'all' ? formsDetail : formsDetail.filter((app) => app.status === filter);
    
    // Sort by date - handle invalid dates properly
    list = [...list].sort((a, b) => {
      const getDate = (app) => {
        const dateStr = app.updated_at || app.created_at || app.Submitted || app.submittedOn;
        if (!dateStr) return new Date(0);
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? new Date(0) : date;
      };
      
      const dateA = getDate(a);
      const dateB = getDate(b);
      
      if (dateSort === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
    
    return list;
  }, [filter, formsDetail, dateSort])


  const Status = ['FORWARDED_TO_TREASURER','FORWARDED_TO_SECRETARY','TREASURER_REJECTED'];
  
  // Function to fetch forms detail
  const fetchFormsDetail = async() => {
    const url = new URL(`${BACKEND_URL}/treasurer/forms`,window.location.origin)
    Status.forEach(status => {
      url.searchParams.append("status",status)
    })
    return fetch(url,{
      headers: {authorization: window.localStorage.getItem("token")}})
      .then(res => {
        if (!res.ok) throw new Error("Invalid or expired link");
        return res.json();
      })
      .then(data => {
        setFormsDetail(data);
        return data;
      })
      .catch(err => {
        console.error("fetch failed", err);
        throw err;
      })
  };

  // Function to fetch forms count
  const fetchFormsCount = () => {
    return fetch(`${BACKEND_URL}/treasurer/formsCount`,{
      headers: {authorization: window.localStorage.getItem("token")}})
      .then(res => {
        if (!res.ok) throw new Error("Invalid or expired link");
        return res.json();
      })
      .then(data => {
        setFormsCount(data[0]);
        return data;
      })
      .catch(err => {
        console.error("fetch failed", err);
        throw err;
      })
  };

  // to get details of all forms based on restricted status
  useEffect(() => {
    fetchFormsDetail();
  }, []);

  // to get summary of forms count
  useEffect(() => {
    fetchFormsCount();
  }, []);



  //total forms counts
  const total = Number(formsCount.pending_verification) +Number(formsCount.rejected) + Number(formsCount.forwarded_to_secretary);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-yellow-500">Treasurer Workspace</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">Membership Verification Dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm text-gray-600">
                Review payment evidence, update remarks and move applications through the workflow.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Applications" value={total} accent="bg-blue-500" />
          <StatCard label="Pending Verification" value={formsCount.pending_verification || 0} accent="bg-yellow-400" />
          <StatCard label="Forwarded to Secretary" value={formsCount.forwarded_to_secretary || 0} accent="bg-green-400" />
          <StatCard label="Rejected" value={formsCount.rejected || 0} accent="bg-red-500" />
        </section>

        <div className="mt-8 flex flex-wrap gap-3 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100">
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key);
                setSelected(null);
              }}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === key ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {meta.label}
            </button>
          ))}
        </div>

        {/* Date Sort Filter */}
        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Applications</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sort by date:</span>
            <button
              type="button"
              onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              {dateSort === 'asc' ? '↑ Oldest First' : '↓ Newest First'}
            </button>
          </div>
        </div>

        {/* Table Header for Row View */}
        <div className="mt-4 hidden md:grid grid-cols-5 gap-4 px-4 py-2 bg-gray-50 rounded-t-lg border border-gray-200">
          <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">Application #</div>
          <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">Applicant</div>
          <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</div>
          <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount</div>
          <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">Reference</div>
        </div>

        <section className="mt-0 space-y-2">
          {filteredList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
              No applications found for this status.
            </div>
          ) : (
            filteredList.map((app) => (
              <ApplicationRow 
                key={app.uuid} 
                application={app} 
                onSelect={async (data) => {
                  setSelected(data);
                  setLoadingDetails(true);
                  setRemark("");
                  
                  try {
                    const url = new URL(`${BACKEND_URL}/treasurer/forms/${data.uuid}`,window.location.origin);
                    if (data.status) {
                      url.searchParams.append('status', data.status);
                    }
                    
                    const response = await fetch(url, {
                      headers: {authorization: window.localStorage.getItem("token")}
                    });
                    if (!response.ok) throw new Error('Failed to fetch details');
                    
                    const fullDetails = await response.json();
                    // getFormDetails returns an array, so get the first element
                    const details = Array.isArray(fullDetails) ? (fullDetails[0] || data) : fullDetails;
                    if (!details) {
                      throw new Error('No details found');
                    }
                    setSelected(details);
                  } catch (err) {
                    console.error('Failed to fetch application details:', err);
                    // Keep the basic data if fetch fails
                  } finally {
                    setLoadingDetails(false);
                  }
                }} 
              />
            ))
          )}
        </section>
      </main>

      {selected ? (
        <DetailPanel 
          application={selected} 
          remark={remark} 
          setRemark={setRemark} 
          onClose={() => {
            setSelected(null);
            setLoadingDetails(false);
          }}
          isLoading={loadingDetails}
          onActionComplete={async () => {
            // Refresh both forms detail and count after action
            await Promise.all([fetchFormsDetail(), fetchFormsCount()]);
          }}
        />
      ) : null}
    </div>
  )
}

