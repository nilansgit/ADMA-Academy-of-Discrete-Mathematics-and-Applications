import { useEffect, useMemo, useState } from 'react'
import Navbar from '../LandingPage/Navbar'
import Footer from '../LandingPage/Footer'
import { useNavigate } from 'react-router-dom'


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
  const meta = STATUS_META[application.status]
  const submittedDate = application.updated_at || application.Submitted || application.submittedOn;
  const formattedDate = submittedDate ? new Date(submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  return (
    <button type="button"
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
          <span className="font-medium text-gray-800">Submitted:</span> {formattedDate}
        </p>
        <p>
          <span className="font-medium text-gray-800">Amount:</span> {application.Amount}
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [remarkError, setRemarkError] = useState('');
  
  if (!application) return null  
  // Parse the data field if it's a string (JSON)
  let formData = null;
  try {
    formData = typeof application.data === 'string' ? JSON.parse(application.data) : application.data;
  } catch (e) {
    console.error('Failed to parse form data:', e);
    formData = application.data || {};
  }
  
  // Format date
  const submittedDate = application.updated_at;
  const formattedDate = submittedDate ? new Date(submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
  
  const handleActionClick = (actionId) => {
    if (actionId === 'reject') {
      // For reject, check if remark is filled
      if (!remark.trim()) {
        setRemarkError('Treasurer remark is required before returning to applicant');
        return;
      }
      setRemarkError('');
      // Show confirmation for reject
      setPendingAction(actionId);
      setShowConfirmModal(true);
    } else if (actionId === 'forward') {
      // Show confirmation for forward
      setPendingAction(actionId);
      setShowConfirmModal(true);
    }
  };
  
  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    
    try {
      const url = new URL(`http://localhost:3000/treasurer/${application.uuid}/${pendingAction}`);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": window.localStorage.getItem("token")
        },
        body: JSON.stringify({"reason": remark})
      });

      if (!response.ok) throw new Error('Action failed');
      
      // Close modal and detail panel
      setShowConfirmModal(false);
      setPendingAction(null);
      onClose(); // Close the detail panel
      
      // Refresh data before redirecting
      if (onActionComplete) {
        onActionComplete();
      }
      
      // Small delay to ensure data refresh starts, then redirect
      setTimeout(() => {
        navigate("/dashboard/treasurer", { replace: true });
      }, 100);
      
    } catch (err) {
      console.error('Failed to process action:', err);
      alert('Failed to process the action. Please try again.');
      setShowConfirmModal(false);
      setPendingAction(null);
      
      // Still refresh and redirect even on error
      if (onActionComplete) {
        onActionComplete();
      }
      onClose(); // Close the detail panel
      setTimeout(() => {
        navigate("/dashboard/treasurer", { replace: true });
      }, 100);
    }
  };
  
  const getConfirmModalProps = () => {
    if (pendingAction === 'forward') {
      return {
        title: 'Confirm Forward to Secretary',
        message: 'Have you verified the payment details? Please confirm that payment verification is complete before forwarding to the Secretary.',
        confirmText: 'Yes, Forward',
        confirmStyle: 'bg-gradient-to-r from-blue-500 to-blue-600'
      };
    } else if (pendingAction === 'reject') {
      return {
        title: 'Confirm Return to Applicant',
        message: `Are you sure you want to return this application to the applicant? The following remark will be sent: "${remark}"`,
        confirmText: 'Yes, Return',
        confirmStyle: 'bg-gradient-to-r from-rose-500 to-rose-600'
      };
    }
    return null;
  };
  
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end bg-black/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-white px-6 py-6 shadow-2xl sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-500">Application</p>
            <h2 className="text-2xl font-bold text-gray-900">{application.uuid || application.id}</h2>
            <p className="text-sm text-gray-500">Submitted on {formattedDate}</p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900">
            Close ✕
          </button>
        </div>
        
        {isLoading && (
          <div className="mt-6 flex items-center justify-center py-12">
            <div className="text-sm text-gray-500">Loading application details...</div>
          </div>
        )}
        
        {!isLoading && (
          <div className="mt-6 space-y-6 text-sm">
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Applicant Info</h3>
              <div className="mt-3 grid gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-gray-800">Name:</span> {formData?.name || application.name || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Citizenship:</span> {formData.citizenship || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Affiliation:</span> {formData.affiliation || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Phone:</span> {formData?.phoneNumber || application.phone || 'N/A'}
                </p>
                <p className="sm:col-span-2">
                  <span className="font-semibold text-gray-800">Email:</span> {application.email || formData?.email || 'N/A'}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Payment Details</h3>
              <div className="mt-3 grid gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-gray-800">Membership Type:</span> {formData?.membershipType.title || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Amount:</span> {formData?.membershipType.fee || application.amount || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Transaction Ref:</span> {formData?.paymentReference || application.paymentReference || application.Reference || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Status:</span> {STATUS_META[application.status]?.label || 'N/A'}
                </p>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-gray-800">Payment Receipt:</span>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {formData?.paymentReceipt && (
                      <a
                        href={formData.paymentReceipt}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        Payment Receipt
                      </a>
                    )}
                    
                    {(!formData?.paymentReceipt) && (
                      <span className="text-xs text-gray-500">Payment Receipt not uploaded by the user</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Treasurer Remark
                <span className="ml-2 text-red-500">*</span>
              </h3>
              <textarea
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value);
                  if (remarkError && e.target.value.trim()) {
                    setRemarkError('');
                  }
                }}
                rows={3}
                placeholder="Eg: Payment verified via UPI. Forwarding to Secretary."
                className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  remarkError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {remarkError && (
                <p className="mt-2 text-xs text-red-600">{remarkError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Required for all actions. This remark will be visible to the applicant.
              </p>
            </section>

            <section className="space-y-3">
              {ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleActionClick(action.id)}
                  disabled={(!remark.trim() && action.id === 'reject') || (action.id === 'forward' && application.status !== 'FORWARDED_TO_TREASURER')}
                  className={`w-full rounded-2xl bg-gradient-to-r ${action.style} px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
                >
                  {action.label}
                </button>
              ))}
              <p className="text-xs text-gray-500">
                Actions will trigger notifications to the applicant and update workflow stages.
              </p>
            </section>
            
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
        )}
      </div>
    </div>
  )
}


export default function TreasurerDashboard() {
  const [filter, setFilter] = useState('FORWARDED_TO_TREASURER')
  const [selected, setSelected] = useState(null)
  const [remark, setRemark] = useState("")
  const [formsCount, setFormsCount] = useState({});
  const [formsDetail,setFormsDetail] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);



  const filteredList = useMemo(() => {
    if (filter === 'all') return formsDetail
    return formsDetail.filter((app) => app.status === filter)
  }, [filter, formsDetail])


  const Status = ['FORWARDED_TO_TREASURER','FORWARDED_TO_SECRETARY','TREASURER_REJECTED'];
  
  // Function to fetch forms detail
  const fetchFormsDetail = async() => {
    const url = new URL("http://localhost:3000/treasurer/forms")
    Status.forEach(status => {
      url.searchParams.append("status",status)
    })
    fetch(url,{
      headers: {authorization: window.localStorage.getItem("token")}})
      .then(res => {
        if (!res.ok) throw new Error("Invalid or expired link");
        return res.json();
      })
      .then(data => {
        setFormsDetail(data);
      })
      .catch(err => {
        console.error("fetch failed", err);
      })
  };

  // Function to fetch forms count
  const fetchFormsCount = () => {
    fetch("http://localhost:3000/treasurer/formsCount",{
      headers: {authorization: window.localStorage.getItem("token")}})
      .then(res => {
        if (!res.ok) throw new Error("Invalid or expired link");
        return res.json();
      })
      .then(data => {
        setFormsCount(data[0]);
      })
      .catch(err => {
        console.error("fetch failed", err);
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
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-yellow-500">Treasurer Workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Membership Verification Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Review payment evidence, update remarks and move applications through the workflow.
          </p>
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

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredList.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
              No applications found for this status.
            </div>
          ) : (
            filteredList.map((app) => (
              <ApplicationCard 
                key={app.uuid} 
                application={app} 
                onSelect={async (data) => {
                  setSelected(data);
                  setLoadingDetails(true);
                  setRemark("");
                  
                  try {
                    const url = new URL(`http://localhost:3000/treasurer/forms/${data.uuid}`);
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
      <Footer />

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
          onActionComplete={() => {
            // Refresh both forms detail and count after action
            fetchFormsDetail();
            fetchFormsCount();
          }}
        />
      ) : null}
    </div>
  )
}

