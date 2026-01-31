import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EDITABLE_STATES, FORM_STATUS } from '../../constants/formStatus';
import validateFile from '../../utils/fileLimit.js'
import { 
  countriesWithPhoneCodes, 
  getCountriesList, 
  getPhoneCountryCodes,
  getPhoneCodeByCountry 
} from '../../data/countriesData.js'

const CITIZENSHIP_TYPES = {
  indian: {
    label: 'Indian',
    currency: 'INR',
    membershipTypes: [
      { id: 'individual', title: 'Life Member (Individual)', fee: 2000, description: 'Lifetime access for individual members' },
      { id: 'benefactor', title: 'Benefactor Life Member', fee: 10000, description: 'Support ADMA initiatives with enhanced benefits' },
      { id: 'patron', title: 'Patron Life Member', fee: 15000, description: 'Premium patron privileges and recognition' },
      { id: 'institutional', title: 'Institutional Member', fee: 3000, description: 'Up to two authorised representatives' },
    ],
  },
  foreign: {
    label: 'International',
    currency: 'USD',
    membershipTypes: [
      { id: 'individual_foreign', title: 'Life Member (Individual)', fee: 200, description: 'Lifetime access for overseas members' },
      { id: 'benefactor_foreign', title: 'Benefactor Life Member', fee: 350, description: 'Support ADMA initiatives internationally' },
      { id: 'patron_foreign', title: 'Patron Life Member', fee: 500, description: 'Premium patron benefits' },
      { id: 'institutional_foreign', title: 'Institutional Member', fee: 250, description: 'Two nominated contacts' },
    ],
  },
}

// Get comprehensive lists from the data file
const phoneCountryCodes = getPhoneCountryCodes();
const countries = getCountriesList();

const BANK_DETAILS = {
  accountName: 'Academy of Discrete Mathematics and Applications',
  accountNumber: '1234567890123456',
  ifscCode: 'BANK0001234',
  bankName: 'State Bank of India',
  branch: 'Mysore Main Branch',
  upiId: 'adma@paytm',
  swiftCode: 'SBININBB123',
}


const MAX_PHOTO_SIZE = 2 * 1024 * 1024;    // 2MB
const MAX_RECEIPT_SIZE = 5 * 1024 * 1024;  // 5MB

const STATUS_MESSAGES = {
  [FORM_STATUS.FORWARDED_TO_TREASURER]: 'Your form is under review by the Treasurer.',
  [FORM_STATUS.FORWARDED_TO_SECRETARY]: 'Your form has been forwarded to the Secretary for final approval.',
  [FORM_STATUS.APPROVED]: 'Congratulations! Your membership has been approved.',
  [FORM_STATUS.TREASURER_REJECTED]: 'Your form was returned by the Treasurer.',
  [FORM_STATUS.SECRETARY_REJECTED]: 'Your form was returned by the Secretary.',
};

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf"
];

// Default form data values
const DEFAULT_FORM_DATA = {
  // Membership type fields
  citizenship: 'indian',
  membershipType: {
    id: 'individual',
    title: 'Life Member (Individual)',
    fee: 2000,
    description: 'Lifetime access for individual members'
  },
  // Step 1 fields
  name: '',
  dobDay: '01',
  dobMonth: 'January',
  dobYear: '1990',
  qualification: '',
  affiliation: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  phoneCode: '+91',
  phoneNumber: '',
  email: '',
  passportNumber: '',
  representativeOne: '',
  representativeTwo: '',
  passportPhoto: '',
  // Step 2 fields
  paymentReference: '',
  paymentReceipt: '',
  notes: '',
}


const BACKEND_URL  = "http://localhost:3000"

export default function MembershipForm() {
  const {uuid} = useParams();
  const [step, setStep] = useState(1)
  const [citizenship, setCitizenship] = useState('indian')
  const [selectedType, setSelectedType] = useState(CITIZENSHIP_TYPES.indian.membershipTypes[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [statusMessage, setStatusMessage] = useState('')
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [uploadFile,setUploadFile] = useState({passportPhoto: null, paymentReceipt: null});
  const [formStatus, setFormStatus] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const days = useMemo(() => Array.from({ length: 31 }, (_, idx) => String(idx + 1).padStart(2, '0')), [])
  const months = useMemo(
    () => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    [],
  )
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 80 }, (_, idx) => String(currentYear - idx))
  }, [])

  // Check if membership type requires DOB, Qualification, Passport Photo
  const requiresPersonalDetails = useMemo(() => {
    return selectedType.id === 'individual' || selectedType.id === 'individual_foreign'
  }, [selectedType])

  // Check if institutional member (requires representatives)
  const isInstitutional = useMemo(() => {
    return selectedType.id === 'institutional' || selectedType.id === 'institutional_foreign'
  }, [selectedType])

  // Sort countries alphabetically for better UX
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => a.localeCompare(b));
  }, []);

  // Sort phone codes by country name for better UX
  const sortedPhoneCodes = useMemo(() => {
    return [...phoneCountryCodes].sort((a, b) => {
      // Extract country name from label (remove flag and code)
      const countryA = a.country || '';
      const countryB = b.country || '';
      return countryA.localeCompare(countryB);
    });
  }, []);

  
  function validateBeforeUpload(uploadFile) {
    if (uploadFile.passportPhoto) {
      const r = validateFile(uploadFile.passportPhoto, {
        maxSize: MAX_PHOTO_SIZE,
        allowedTypes: PHOTO_TYPES
      });
      if (!r.valid) return r;
    }
  
    if (uploadFile.paymentReceipt) {
      const r = validateFile(uploadFile.paymentReceipt, {
        maxSize: MAX_RECEIPT_SIZE,
        allowedTypes: RECEIPT_TYPES
      });
      if (!r.valid) return r;
    }
  
    return { valid: true };
  }
  


  // Load draft using uuid
  useEffect(() => {
    fetch(`http://localhost:3000/forms/${uuid}`)
      .then(res => {
        if (!res.ok) throw new Error("Invalid or expired link");
        return res.json();
      })
      .then(form => {
        const status = form.status || FORM_STATUS.DRAFT;
        setFormStatus(status);
        setRejectionReason(form.rejection_reason || null);
        if (!EDITABLE_STATES.includes(status)) {
          setIsSubmitted(true);
        }
        // Merge loaded data with defaults to ensure all default values are preserved
        const loadedData = { ...DEFAULT_FORM_DATA, ...(form.data || {}) };
        setFormData(loadedData);

        // Restore citizenship and membership type from loaded data
        if (loadedData.citizenship) {
          setCitizenship(loadedData.citizenship);
        }
        if (loadedData.membershipType && loadedData.membershipType.id) {
          setSelectedType(loadedData.membershipType);
        }

        setStep(form.current_step || 1);
        setIsInitialLoad(false);
      })
      .catch(() => {
        // If form doesn't exist, still mark as loaded so auto-save can work
        setIsInitialLoad(false);
      });
  }, [uuid]);

  // Show status/rejection modal when form is loaded and status is not DRAFT (or is rejected)
  useEffect(() => {
    if (isInitialLoad || !formStatus) return;
    if (formStatus === FORM_STATUS.DRAFT) return;
    setShowStatusModal(true);
  }, [isInitialLoad, formStatus]);


  const handleCitizenshipChange = (type) => {
    setCitizenship(type)
    const newType = CITIZENSHIP_TYPES[type].membershipTypes[0]
    setSelectedType(newType)
    // Save to formData
    setFormData(prev => ({
      ...prev,
      citizenship: type,
      membershipType: newType
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      // Auto-sync phone code when country changes
      if (name === 'country') {
        const phoneCode = getPhoneCodeByCountry(value)
        updated.phoneCode = phoneCode
      }
      return updated
    })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setUploadFile((prev) => ({ ...prev, [name]: files?.[0] ?? null }))
  }

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      alert('Name is required')
      return false
    }
    if (requiresPersonalDetails) {
      if (!formData.qualification.trim()) {
        alert('Qualification is required')
        return false
      }
      if (!formData.passportPhoto) {
        alert('Passport photo is required')
        return false
      }
    }
    if (!formData.affiliation.trim()) {
      alert('Current affiliation is required')
      return false
    }
    if (!formData.addressLine1.trim()) {
      alert('Address is required')
      return false
    }
    if (!formData.city.trim() || !formData.state.trim() || !formData.postalCode.trim()) {
      alert('City, State, and Postal Code are required')
      return false
    }
    if (!formData.phoneNumber.trim()) {
      alert('Phone number is required')
      return false
    }
    if (!formData.email.trim()) {
      alert('Email is required')
      return false
    }
    if (citizenship === 'foreign' && !formData.passportNumber.trim()) {
      alert('Passport number is required for international members')
      return false
    }
    if (isInstitutional) {
      if (!formData.representativeOne.trim() || !formData.representativeTwo.trim()) {
        alert('Both representative names are required for institutional membership')
        return false
      }
    }
    return true
  }

  const uploadFiles = async () => {
    if(isSubmitted) return;

    if(!uploadFile.passportPhoto && !uploadFile.paymentReceipt) return;

    const check = validateBeforeUpload(uploadFile);

    if (!check.valid) {
      alert(check.error);
      return;
    }


    const fd = new FormData();

    if(uploadFile.passportPhoto) fd.append("passportPhoto",uploadFile.passportPhoto);
    if(uploadFile.paymentReceipt) fd.append("paymentReceipt", uploadFile.paymentReceipt);

    const res = await fetch(`http://localhost:3000/forms/${uuid}/upload`, {
      method: "POST",
      body: fd
    })

    if(res.ok){
      const data = await res.json();

      if(data.result[0].pp && uploadFile.passportPhoto){
        setFormData((prev) => ({ ...prev, passportPhoto: data.result[0].pp }))
        setUploadFile({passportPhoto: null, paymentReceipt: null});
        alert("passportPhoto upload Success")
      }

      if(data.result[0].receipt && uploadFile.paymentReceipt){
        setFormData((prev) => ({ ...prev, paymentReceipt: data.result[0].receipt }))
        setUploadFile({passportPhoto: null, paymentReceipt: null});
        alert("paymentReceipt upload Success")
      }
    }else{
      alert("upload failed")
    }
  }


  const saveDraft = async (formData, step, emailValue) => {
    if(isSubmitted) return;
    await fetch(`http://localhost:3000/forms/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: formData,
        currentStep: step,
        email: emailValue
      })
    });
  };

  useEffect(() => {
    if (isInitialLoad) return;
  
    const timeout = setTimeout(() => {
      (async () => {
        try {
          await saveDraft(formData, step, formData.email || null);
        } catch (e) {
          console.error("Autosave failed");
        }
      })();
    }, 2000);
  
    return () => clearTimeout(timeout);
  }, [formData, step, isInitialLoad]);
  

  //FOR FILE DRAFT
  // useEffect(() => {
  //   if (isInitialLoad) return;

  //   uploadFiles();
  // },[uploadFile, isInitialLoad]);

  useEffect(() => {
    if (isInitialLoad) return;
    if (!uploadFile) return;
  
    (async () => {
      try {
        await uploadFiles();
      } catch (e) {
        console.error("Upload failed", e);
      }
    })();
  }, [uploadFile, isInitialLoad]);
  
  
  
  
  const handleProceedToPayment = async (e) => {
    e.preventDefault()
    if (validateStep1()) {
      setStep(2)
      // await saveDraft(formData, step, formData.email);
    }
  }

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!formData.paymentReference.trim()) {
      alert('Transaction reference number is required');
      return;
    }
    setShowSubmitConfirm(true);
  };

  const handleSubmitConfirm = async () => {
    setShowSubmitConfirm(false);
    setIsSubmitting(true);
    await saveDraft(formData, step, formData.email);
    try {
      const res = await fetch(
        `http://localhost:3000/forms/${uuid}/submit`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error();
      setIsSubmitted(true);
      setStatusMessage('Your Form has been Submitted');
      
      if(formStatus === FORM_STATUS.SECRETARY_REJECTED){
        setFormStatus(FORM_STATUS.FORWARDED_TO_SECRETARY);
      }else{
        setFormStatus(FORM_STATUS.FORWARDED_TO_TREASURER);
      }
    } catch {
      alert("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      console.log("Form was submitted");
      // side effects here
    }
  }, [isSubmitted]);
    


  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0">
        <header className="mb-8 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 text-gray-600 hover:text-gray-900">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Home
          </a>
          <img src="/adma_logo.svg" alt="ADMA" className="h-12 w-12" />
        </header>

        <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <span className="text-lg font-bold">1</span>
              </div>
              <div className={`h-1 w-24 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <span className="text-lg font-bold">2</span>
              </div>
            </div>
            <div className="mt-2 flex justify-center gap-24">
              <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Personal Details</span>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Payment Details</span>
            </div>
          </div>

          <div className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">Membership Form</h1>
            <p className="mt-2 text-gray-600">
              {step === 1
                ? 'Complete your personal details. Fields marked in red are mandatory.'
                : 'Review your details and complete payment information.'}
            </p>

            {step === 1 && (
              <>
                <div className="mt-6 flex flex-wrap gap-3">
                  {Object.entries(CITIZENSHIP_TYPES).map(([key, value]) => (
                    <button
                      key={key}
                      disabled = {isSubmitted}
                      onClick={() => handleCitizenshipChange(key)}
                      className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                        citizenship === key ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>

                {/* Membership type cards - Only in step 1 */}
                <div className="mt-8 grid gap-4 lg:grid-cols-4">
                  {CITIZENSHIP_TYPES[citizenship].membershipTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      disabled = {isSubmitted}
                      onClick={() => {
                        setSelectedType(type);
                        // Save to formData
                        setFormData(prev => ({
                          ...prev,
                          membershipType: type
                        }));
                      }}
                      className={`rounded-2xl border-2 p-4 text-left transition-shadow ${
                        selectedType.id === type.id
                          ? 'border-blue-500 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-xl'
                          : 'border-transparent bg-blue-50 text-blue-900 hover:shadow'
                      }`}
                    >
                      <p className="text-sm font-semibold uppercase tracking-wide">
                        {CITIZENSHIP_TYPES[citizenship].currency} {type.fee.toLocaleString()}
                      </p>
                      <p className="mt-2 text-lg font-bold">{type.title}</p>
                      <p className={`mt-1 text-sm ${selectedType.id === type.id ? 'text-blue-50/80' : 'text-blue-900/70'}`}>
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {step === 1 ? (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Name */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled = {isSubmitted}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-full border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Full name as per official documents"
                />
              </div>

              {/* Date of Birth - Only for Individual members */}
              {requiresPersonalDetails && (
                <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                  <label className="text-sm font-semibold text-red-500">Date of Birth *</label>
                  <div className="grid grid-cols-3 gap-3">
                    <select name="dobDay" value={formData.dobDay} disabled = {isSubmitted} onChange={handleInputChange} className="rounded-full border border-gray-200 px-4 py-3">
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      name="dobMonth"
                      value={formData.dobMonth}
                      disabled = {isSubmitted}
                      onChange={handleInputChange}
                      className="rounded-full border border-gray-200 px-4 py-3"
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      name="dobYear"
                      value={formData.dobYear}
                      disabled = {isSubmitted}
                      onChange={handleInputChange}
                      className="rounded-full border border-gray-200 px-4 py-3"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Qualification - Only for Individual members */}
              {requiresPersonalDetails && (
                <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                  <label className="text-sm font-semibold text-red-500">Qualifications *</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    disabled = {isSubmitted}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-full border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., Ph.D. in Discrete Mathematics"
                  />
                </div>
              )}

              {/* Current affiliation */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Current Affiliation *</label>
                <input
                  type="text"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleInputChange}
                  disabled = {isSubmitted}
                  required
                  className="w-full rounded-full border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Institution / Organization"
                />
              </div>

              {/* Address */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">
                  Address *
                  <span className="block text-xs font-normal text-gray-500">Include street, city, state, and country</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    disabled = {isSubmitted}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-full border border-gray-200 px-4 py-3"
                    placeholder="Address line 1"
                  />
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    disabled = {isSubmitted}
                    onChange={handleInputChange}
                    className="w-full rounded-full border border-gray-200 px-4 py-3"
                    placeholder="Address line 2 (optional)"
                  />
                  <div className="grid gap-3 md:grid-cols-3">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      disabled = {isSubmitted}
                      onChange={handleInputChange}
                      required
                      className="rounded-full border border-gray-200 px-4 py-3"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      disabled = {isSubmitted}
                      onChange={handleInputChange}
                      required
                      className="rounded-full border border-gray-200 px-4 py-3"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      disabled = {isSubmitted}
                      onChange={handleInputChange}
                      required
                      className="rounded-full border border-gray-200 px-4 py-3"
                      placeholder="Pincode / Zip"
                    />
                  </div>
                </div>
              </div>

              {/* Country & Phone */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Country & Phone *</label>
                <div className="grid gap-3 md:grid-cols-[1.5fr,1fr]">
                  <select
                    name="country"
                    value={formData.country}
                    disabled = {isSubmitted}
                    onChange={handleInputChange}
                    className="rounded-full border border-gray-200 px-4 py-3"
                  >
                    {sortedCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-3">
                    <select
                      name="phoneCode"
                      value={formData.phoneCode}
                      disabled = {isSubmitted}
                      onChange={handleInputChange}
                      className="rounded-full border border-gray-200 px-3 py-3"
                    >
                      {sortedPhoneCodes.map((entry) => (
                        <option key={entry.code} value={entry.code}>
                          {entry.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      disabled = {isSubmitted}
                      onChange={handleInputChange}
                      required
                      className="flex-1 rounded-full border border-gray-200 px-4 py-3"
                      placeholder="WhatsApp number"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled = {isSubmitted}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-full border border-gray-200 px-4 py-3"
                  placeholder="Email for all communications"
                />
              </div>

              {/* Passport number (for foreign) */}
              {citizenship === 'foreign' && (
                <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                  <label className="text-sm font-semibold text-red-500">Passport Number *</label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    disabled = {isSubmitted}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-full border border-gray-200 px-4 py-3"
                    placeholder="As per passport"
                  />
                </div>
              )}

              {/* Representatives (institutional only) */}
              {isInstitutional && (
                <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                  <label className="text-sm font-semibold text-red-500">Representative Names *</label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      name="representativeOne"
                      value={formData.representativeOne}
                      disabled = {isSubmitted}
                      onChange={handleInputChange}
                      required
                      className="rounded-full border border-gray-200 px-4 py-3"
                      placeholder="Representative 1"
                    />
                    <input
                      type="text"
                      name="representativeTwo"
                      value={formData.representativeTwo}
                      disabled = {isSubmitted}
                      onChange={handleInputChange}
                      required
                      className="rounded-full border border-gray-200 px-4 py-3"
                      placeholder="Representative 2"
                    />
                  </div>
                </div>
              )}

              {/* Passport Photo - Only for Individual members */}
              {requiresPersonalDetails && (
                <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                  <label className="text-sm font-semibold text-red-500">Passport Photo *</label>
                  <input
                    type="file"
                    name="passportPhoto"
                    disabled = {isSubmitted}
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                    required ={!formData.passportPhoto}
                    className="w-full rounded-full border border-dashed border-gray-300 px-4 py-3 text-sm"
                  />
                  <p className="col-start-2 text-xs text-gray-500">JPEG, JPG or PNG, max 2MB. </p>
                  {formData.passportPhoto && (
                    <a href={`${BACKEND_URL}/membership/${uuid}/passportPhoto`} target="_blank">
                      View photo
                    </a>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-3 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                {isSubmitted ? "View Payment Details" : "Proceed to Payment"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitClick} className="space-y-6">
              {/* Review Section - Step 1 Details */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Review Your Details</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Membership Information</h3>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-medium text-gray-700">Citizenship</dt>
                        <dd className="text-gray-900">{CITIZENSHIP_TYPES[citizenship].label}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">Membership Type</dt>
                        <dd className="text-gray-900">{selectedType.title}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">Membership Fee</dt>
                        <dd className="text-gray-900 font-semibold">
                          {CITIZENSHIP_TYPES[citizenship].currency} {selectedType.fee.toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Personal Information</h3>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-medium text-gray-700">Full Name</dt>
                        <dd className="text-gray-900">{formData.name || '—'}</dd>
                      </div>
                      {requiresPersonalDetails && (
                        <>
                          <div>
                            <dt className="font-medium text-gray-700">Date of Birth</dt>
                            <dd className="text-gray-900">
                              {formData.dobDay} {formData.dobMonth} {formData.dobYear}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-medium text-gray-700">Qualification</dt>
                            <dd className="text-gray-900">{formData.qualification || '—'}</dd>
                          </div>
                        </>
                      )}
                      <div>
                        <dt className="font-medium text-gray-700">Current Affiliation</dt>
                        <dd className="text-gray-900">{formData.affiliation || '—'}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Contact Information</h3>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-medium text-gray-700">Email</dt>
                        <dd className="text-gray-900">{formData.email || '—'}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">Phone</dt>
                        <dd className="text-gray-900">
                          {formData.phoneCode} {formData.phoneNumber || '—'}
                        </dd>
                      </div>
                      {citizenship === 'foreign' && formData.passportNumber && (
                        <div>
                          <dt className="font-medium text-gray-700">Passport Number</dt>
                          <dd className="text-gray-900">{formData.passportNumber}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Address</h3>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-medium text-gray-700">Address</dt>
                        <dd className="text-gray-900">
                          {formData.addressLine1 || '—'}
                          {formData.addressLine2 && <>, {formData.addressLine2}</>}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">City, State, Postal Code</dt>
                        <dd className="text-gray-900">
                          {formData.city || '—'}, {formData.state || '—'} - {formData.postalCode || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">Country</dt>
                        <dd className="text-gray-900">{formData.country || '—'}</dd>
                      </div>
                    </dl>
                  </div>

                  {isInstitutional && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Representatives</h3>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="font-medium text-gray-700">Representative 1</dt>
                          <dd className="text-gray-900">{formData.representativeOne || '—'}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-700">Representative 2</dt>
                          <dd className="text-gray-900">{formData.representativeTwo || '—'}</dd>
                        </div>
                      </dl>
                    </div>
                  )}

                  {requiresPersonalDetails && formData.passportPhoto && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Documents</h3>
                      <p className="text-sm text-gray-900">✓ Passport Photo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information Section */}
              <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Payment Information</h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Bank Details */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Bank Transfer Details</h3>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="font-medium text-gray-700">Account Name</dt>
                        <dd className="mt-1 text-gray-900">{BANK_DETAILS.accountName}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">Account Number</dt>
                        <dd className="mt-1 font-mono text-gray-900">{BANK_DETAILS.accountNumber}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">IFSC Code</dt>
                        <dd className="mt-1 font-mono text-gray-900">{BANK_DETAILS.ifscCode}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">Bank Name</dt>
                        <dd className="mt-1 text-gray-900">{BANK_DETAILS.bankName}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">Branch</dt>
                        <dd className="mt-1 text-gray-900">{BANK_DETAILS.branch}</dd>
                      </div>
                      {citizenship === 'foreign' && (
                        <div>
                          <dt className="font-medium text-gray-700">SWIFT Code</dt>
                          <dd className="mt-1 font-mono text-gray-900">{BANK_DETAILS.swiftCode}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* UPI Details */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">UPI Payment</h3>
                    <div className="mb-4">
                      <dt className="mb-2 text-sm font-medium text-gray-700">UPI ID</dt>
                      <dd className="font-mono text-lg text-gray-900">{BANK_DETAILS.upiId}</dd>
                    </div>
                    <div className="mt-4 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">UPI QR Code</p>
                        <p className="mt-2 text-xs text-gray-400">(QR code image will be displayed here)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Payment Amount:</strong> {CITIZENSHIP_TYPES[citizenship].currency} {selectedType.fee.toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs text-yellow-700">
                    Please make the payment using any of the above methods and enter the transaction reference below.
                  </p>
                </div>
              </div>

              {/* Transaction Reference */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Transaction Reference *</label>
                <input
                  type="text"
                  name="paymentReference"
                  value={formData.paymentReference}
                  disabled = {isSubmitted}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-full border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="UPI/IMPS/NEFT/RTGS Transaction ID"
                />
              </div>

              {/* Payment Receipt Upload */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-gray-700">Payment Receipt (Optional)</label>
                <div>
                  <input
                    type="file"
                    name="paymentReceipt"
                    accept=".pdf,.jpeg,.jpg,.png"
                    onChange={handleFileChange}
                    disabled = {isSubmitted}
                    className="w-full rounded-full border border-dashed border-gray-300 px-4 py-3 text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">PDF, JPEG, or PNG, max 5MB</p>
                  {formData.paymentReceipt && (
                    <a href={`${BACKEND_URL}/membership/${uuid}/paymentReceipt`} target="_blank">
                      View Receipt
                    </a>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-gray-700">Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  disabled = {isSubmitted}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  ← Back to Step 1
                </button>
                {statusMessage && <p className="text-sm text-green-600">{statusMessage}</p>}
                <button
                  type="submit"
                  disabled={isSubmitted || isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-3 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : isSubmitted ? 'Submitted' : 'Submit Now'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Submit confirmation modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900">Confirm Submission</h3>
            <p className="mt-3 text-gray-600">
              Are you sure you want to submit your membership form? Once submitted, you will not be able to edit until it is reviewed.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="rounded-full border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitConfirm}
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 font-semibold text-white hover:from-blue-700 hover:to-blue-800"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status / rejection info modal */}
      {showStatusModal && formStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900">Form Status</h3>
            <div className="mt-3 space-y-2">
              <p className="text-gray-600">
                {STATUS_MESSAGES[formStatus] || `Your form status: ${formStatus}`}
              </p>
              {rejectionReason && EDITABLE_STATES.includes(formStatus) && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <p className="text-sm font-semibold text-amber-800">Reason for return:</p>
                  <p className="mt-1 text-sm text-amber-900">{rejectionReason}</p>
                  <p className="mt-2 text-sm text-amber-700">Please make the necessary changes and resubmit.</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="rounded-full bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
