import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../LandingPage/Navbar";
import Footer from "../LandingPage/Footer";

const STATUS_META = {
  all: { label: "All", badge: "bg-gray-100 text-gray-700" },
  FORWARDED_TO_SECRETARY: {
    label: "Pending Review",
    badge: "bg-yellow-100 text-yellow-800",
  },
  APPROVED: { label: "Approved", badge: "bg-green-100 text-green-800" },
  SECRETARY_REJECTED: {
    label: "Returned / Rejected",
    badge: "bg-red-100 text-red-800",
  },
};

const ACTIONS = [
  {
    id: "approve",
    label: "Confirm Details & Generate Membership",
    style: "from-green-500 to-green-600",
  },
  {
    id: "reject",
    label: "Return to Applicant",
    style: "from-rose-500 to-rose-600",
  },
];

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <div className={`mt-4 h-1 rounded-full ${accent}`} />
    </div>
  );
}

function ApplicationCard({ application, onClick }) {
  const statusMeta = STATUS_META[application.status] || STATUS_META.pending;
  const submittedDate =
    application.updated_at || application.Submitted || application.submittedOn;
  const formattedDate = submittedDate
    ? new Date(submittedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <button
      type="button"
      onClick={() => onClick(application)}
      className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-400 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {application.name}
          </p>
          <p className="text-xs text-gray-500">{application.membershipType}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badge}`}
        >
          {statusMeta.label}
        </span>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-gray-800">Forwarded:</span>{" "}
          {formattedDate}
        </p>
        <p>
          <span className="font-medium text-gray-800">Amount:</span>{" "}
          {application.Amount}
        </p>
        <p>
          <span className="font-medium text-gray-800">Reference:</span>{" "}
          {application.paymentReference}
        </p>
        <p>
          <span className="font-medium text-gray-800">Affiliation:</span>{" "}
          {application.affiliation}
        </p>
      </div>
      <p className="mt-4 text-xs text-gray-500">{application.note}</p>
    </button>
  );
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmStyle,
}) {
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

function DetailPanel({
  application,
  remark,
  setRemark,
  onClose,
  isLoading,
  onActionComplete,
}) {
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
    } else if (actionId === "approve") {
      // Show confirmation for approve
      setPendingAction(actionId);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    try {
      const url = new URL(
        `http://localhost:3000/secretary/${application.uuid}/${pendingAction}`
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
        navigate("/dashboard/secretary", { replace: true });
      }, 100);
    } catch (err) {
      console.error("Failed to process action:", err);
      alert("Failed to process the action. Please try again.");
      setShowConfirmModal(false);
      setPendingAction(null);

      if (onActionComplete) {
        onActionComplete();
      }
      onClose(); // Close the detail panel
      setTimeout(() => {
        navigate("/dashboard/secretary", { replace: true });
      }, 100);
    }
  };

  const getConfirmModalProps = () => {
    if (pendingAction === "approve") {
      return {
        title: "Confirm Membership of the Applicant",
        message: `This action will approve the membership of the applicant & generate their membership card.`,
        confirmText: "Yes, Approve",
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

  const formData = application?.data || {};

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
                  ID:{" "}
                  <span className="font-semibold text-gray-700">
                    {application.uuid || application.id}
                  </span>
                </p>
              </div>
            </div>

            {/* Personal & Contact Info Grid */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <InfoSection title="Personal Information">
                <InfoItem label="Full Name" value={formData.name} />
                <InfoItem
                  label="Date of Birth"
                  value={
                    formData.dobDay
                      ? `${formData.dobDay} ${formData.dobMonth} ${formData.dobYear}`
                      : undefined
                  }
                />
                <InfoItem
                  label="Qualification"
                  value={formData.qualification}
                />
                <InfoItem label="Affiliation" value={formData.affiliation} />
                <InfoItem label="Citizenship" value={formData.citizenship} />
                {formData.passportNumber && (
                  <InfoItem
                    label="Passport Number"
                    value={formData.passportNumber}
                  />
                )}
              </InfoSection>

              <InfoSection title="Contact Information">
                <InfoItem
                  label="Email"
                  value={application.email || formData.email}
                />
                <InfoItem
                  label="Phone"
                  value={`${formData.phoneCode} ${formData.phoneNumber}`}
                />
                <InfoItem
                  label="Address"
                  value={`${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state} - ${formData.postalCode}`}
                />
                <InfoItem label="Country" value={formData.country} />
              </InfoSection>
            </div>

            {/* Institutional Representatives */}
            {(formData.representativeOne || formData.representativeTwo) && (
              <div className="mt-6">
                <InfoSection title="Institutional Representatives">
                  {formData.representativeOne && (
                    <InfoItem
                      label="Representative 1"
                      value={formData.representativeOne}
                    />
                  )}
                  {formData.representativeTwo && (
                    <InfoItem
                      label="Representative 2"
                      value={formData.representativeTwo}
                    />
                  )}
                </InfoSection>
              </div>
            )}

            {/* Membership & Payment */}
            <div className="mt-6">
              <InfoSection title="Membership & Payment">
                <InfoItem
                  label="Membership Type"
                  value={formData.membershipType?.title}
                />
                <InfoItem
                  label="Amount"
                  value={`₹${formData.membershipType?.fee || "0"}`}
                />
                <InfoItem
                  label="Payment Reference"
                  value={formData.paymentReference}
                />
                <InfoItem
                  label="Created On"
                  value={
                    application.created_at
                      ? new Date(application.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : undefined
                  }
                />
                <InfoItem
                  label="Forwarded On"
                  value={
                    application.updated_at
                      ? new Date(application.updated_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : undefined
                  }
                />
              </InfoSection>
            </div>

            {/* Documents */}
            {(formData.passportPhoto || formData.paymentReceipt) && (
              <div className="mt-6">
                <InfoSection title="Documents">
                  <div className="pt-2 flex gap-3 flex-wrap">
                    {formData.passportPhoto && (
                      <a
                        href={`http://localhost:3000/${formData.passportPhoto}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition border border-blue-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Passport Photo
                      </a>
                    )}
                    {formData.paymentReceipt && (
                      <a
                        href={`http://localhost:3000/${formData.paymentReceipt}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition border border-green-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Payment Receipt
                      </a>
                    )}
                  </div>
                </InfoSection>
              </div>
            )}

            {/* Remarks Section */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50/50 to-white p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Remarks / Notes
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
                placeholder="Enter remarks or reason for your action..."
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
                        application.status !== "FORWARDED_TO_SECRETARY")) ||
                    (action.id === "approve" &&
                      application.status !== "FORWARDED_TO_SECRETARY")
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

export default function SecretaryDashboard() {
  const [selectedStatus, setSelectedStatus] = useState(
    "FORWARDED_TO_SECRETARY"
  );
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [remark, setRemark] = useState("");
  const [formsCount, setFormsCount] = useState({});
  const [formsDetail, setFormsDetail] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const filteredApplications = useMemo(() => {
    if (selectedStatus === "all") return formsDetail;
    return formsDetail.filter((app) => app.status === selectedStatus);
  }, [selectedStatus, formsDetail]);

  const Status = ["FORWARDED_TO_SECRETARY", "APPROVED", "SECRETARY_REJECTED"];

  // Fetch forms detail
  const fetchFormsDetail = async () => {
    const url = new URL("http://localhost:3000/secretary/forms");
    Status.forEach((status) => {
      url.searchParams.append("status", status);
    });
    fetch(url, {
      headers: { authorization: window.localStorage.getItem("token") },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired link");
        return res.json();
      })
      .then((data) => {
        setFormsDetail(data);
      })
      .catch((err) => {
        console.error("fetch failed", err);
      });
  };

  // Function to fetch forms count
  const fetchFormsCount = () => {
    fetch("http://localhost:3000/secretary/formsCount", {
      headers: { authorization: window.localStorage.getItem("token") },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired link");
        return res.json();
      })
      .then((data) => {
        setFormsCount(data[0]);
      })
      .catch((err) => {
        console.error("fetch failed", err);
      });
  };

  // To get details of all forms
  useEffect(() => {
    fetchFormsDetail();
  }, []);

  // to get summary of forms count
  useEffect(() => {
    fetchFormsCount();
  }, []);

  // Total no. of forms
  const total =
    Number(formsCount.pending) +
    Number(formsCount.approved) +
    Number(formsCount.rejected);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-yellow-500">
            Secretary Workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Membership Approval Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Review and approve membership applications forwarded by Treasurer
          </p>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Applications"
            value={total}
            accent="bg-blue-500"
          />
          <StatCard
            label="Pending Review"
            value={formsCount.pending}
            accent="bg-yellow-500"
          />
          <StatCard
            label="Approved"
            value={formsCount.approved}
            accent="bg-green-500"
          />
          <StatCard
            label="Rejected"
            value={formsCount.rejected}
            accent="bg-red-500"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100">
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedStatus(key);
                setSelectedApplication(null);
              }}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold transition ${
                selectedStatus === key
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {meta.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
              No applications found for this status.
            </div>
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onClick={async (data) => {
                  setSelectedApplication(data);
                  setLoadingDetails(true);
                  setRemark("");

                  try {
                    const url = new URL(
                      `http://localhost:3000/secretary/forms/${data.uuid}`
                    );
                    if (data.status) {
                      url.searchParams.append("status", data.status);
                    }

                    const response = await fetch(url, {
                      headers: {
                        authorization: window.localStorage.getItem("token"),
                      },
                    });
                    if (!response.ok)
                      throw new Error("Failed to fetch details");

                    const fullDetails = await response.json();
                    // getFormDetails returns an array, so get the first element
                    const details = Array.isArray(fullDetails)
                      ? fullDetails[0] || data
                      : fullDetails;

                    if (!details) {
                      throw new Error("No details found");
                    }
                    setSelectedApplication(details);
                  } catch (err) {
                    console.error("Failed to fetch application details:", err);
                  } finally {
                    setLoadingDetails(false);
                  }
                }}
              />
            ))
          )}
        </div>
      </main>
      <Footer />

      {selectedApplication && (
        <DetailPanel
          application={selectedApplication}
          remark={remark}
          setRemark={setRemark}
          onClose={() => {
            setSelectedApplication(null);
            setLoadingDetails(false);
          }}
          isLoading={loadingDetails}
          onActionComplete={() => {
            fetchFormsDetail();
            fetchFormsCount();
          }}
        />
      )}
    </div>
  );
}
