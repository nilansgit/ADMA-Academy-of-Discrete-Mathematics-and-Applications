import { useMemo, useState } from 'react'

const CITIZENSHIP_TYPES = {
  indian: {
    label: 'Indian Citizen',
    currency: 'INR',
    membershipTypes: [
      { id: 'individual', title: 'Life Member (Individual)', fee: 2000, description: 'Lifetime access for individual members' },
      { id: 'benefactor', title: 'Benefactor Life Member', fee: 10000, description: 'Support ADMA initiatives with enhanced benefits' },
      { id: 'patron', title: 'Patron Life Member', fee: 15000, description: 'Premium patron privileges and recognition' },
      { id: 'institutional', title: 'Institutional Member', fee: 3000, description: 'Up to two authorised representatives' },
    ],
    requirements: [
      'Passport size photograph (≤2MB)',
      'Date of Birth',
      'Qualification',
      'Current affiliation',
      'Address + email',
      'Mobile phone (WhatsApp preferred)',
    ],
  },
  foreign: {
    label: 'Foreign Citizen',
    currency: 'USD',
    membershipTypes: [
      { id: 'individual_foreign', title: 'Life Member (Individual)', fee: 200, description: 'Lifetime access for overseas members' },
      { id: 'benefactor_foreign', title: 'Benefactor Life Member', fee: 350, description: 'Support ADMA initiatives internationally' },
      { id: 'patron_foreign', title: 'Patron Life Member', fee: 500, description: 'Premium patron benefits' },
      { id: 'institutional_foreign', title: 'Institutional Member', fee: 250, description: 'Two nominated contacts' },
    ],
    requirements: [
      'Passport size photograph (≤2MB)',
      'Date of Birth',
      'Qualification',
      'Current affiliation',
      'Address with country + email',
      'Mobile phone with country code',
    ],
  },
}

const phoneCountryCodes = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+971', label: '🇦🇪 +971' },
]

const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Singapore', 'France', 'Germany', 'United Arab Emirates']

export default function MembershipForm() {
  const [citizenship, setCitizenship] = useState('indian')
  const [selectedType, setSelectedType] = useState(CITIZENSHIP_TYPES.indian.membershipTypes[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [formData, setFormData] = useState({
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
    paymentReference: '',
    passportNumber: '',
    representativeOne: '',
    representativeTwo: '',
    notes: '',
    passportPhoto: null,
    paymentProof: null,
  })

  const days = useMemo(() => Array.from({ length: 31 }, (_, idx) => String(idx + 1).padStart(2, '0')), [])
  const months = useMemo(
    () => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    [],
  )
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 80 }, (_, idx) => String(currentYear - idx))
  }, [])

  const handleCitizenshipChange = (type) => {
    setCitizenship(type)
    setSelectedType(CITIZENSHIP_TYPES[type].membershipTypes[0])
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData((prev) => ({ ...prev, [name]: files?.[0] ?? null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage('')

    // Simulated API call
    setTimeout(() => {
      setIsSubmitting(false)
      setStatusMessage('Thanks! Your membership application has been submitted. We will email you updates after verification.')
      console.log('Submitted membership application:', {
        ...formData,
        membershipType: selectedType,
        citizenship,
      })
    }, 1200)
  }

  const requirementList = CITIZENSHIP_TYPES[citizenship].requirements

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
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">Membership Form</h1>
            <p className="mt-2 text-gray-600">
              Complete the fields based on your membership type. Fields marked in red are mandatory.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {Object.entries(CITIZENSHIP_TYPES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleCitizenshipChange(key)}
                  className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                    citizenship === key ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>
          </div>

          {/* Membership type cards */}
          <div className="mb-8 grid gap-4 lg:grid-cols-4">
            {CITIZENSHIP_TYPES[citizenship].membershipTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type)}
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
                <p className={`mt-1 text-sm ${selectedType.id === type.id ? 'text-blue-50/80' : 'text-blue-900/70'}`}>{type.description}</p>
              </button>
            ))}
          </div>

          <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-full border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Full name as per official documents"
                />
              </div>

              {/* Date of Birth */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Date of Birth *</label>
                <div className="grid grid-cols-3 gap-3">
                  <select name="dobDay" value={formData.dobDay} onChange={handleInputChange} className="rounded-full border border-gray-200 px-4 py-3">
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    name="dobMonth"
                    value={formData.dobMonth}
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

              {/* Qualification */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Qualifications *</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-full border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Ph.D. in Discrete Mathematics"
                />
              </div>

              {/* Current affiliation */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Current Affiliation *</label>
                <input
                  type="text"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-full border border-gray-200 px-4 py-3"
                    placeholder="Address line 1"
                  />
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full rounded-full border border-gray-200 px-4 py-3"
                    placeholder="Address line 2 (optional)"
                  />
                  <div className="grid gap-3 md:grid-cols-3">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="rounded-full border border-gray-200 px-4 py-3"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="rounded-full border border-gray-200 px-4 py-3"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
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
                    onChange={handleInputChange}
                    className="rounded-full border border-gray-200 px-4 py-3"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-3">
                    <select
                      name="phoneCode"
                      value={formData.phoneCode}
                      onChange={handleInputChange}
                      className="rounded-full border border-gray-200 px-3 py-3"
                    >
                      {phoneCountryCodes.map((entry) => (
                        <option key={entry.code} value={entry.code}>
                          {entry.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
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
                    onChange={handleInputChange}
                    className="w-full rounded-full border border-gray-200 px-4 py-3"
                    required={citizenship === 'foreign'}
                    placeholder="As per passport"
                  />
                </div>
              )}

              {/* Representatives (institutional) */}
              {selectedType.id.includes('institutional') && (
                <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                  <label className="text-sm font-semibold text-red-500">Representative Names *</label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      name="representativeOne"
                      value={formData.representativeOne}
                      onChange={handleInputChange}
                      required
                      className="rounded-full border border-gray-200 px-4 py-3"
                      placeholder="Representative 1"
                    />
                    <input
                      type="text"
                      name="representativeTwo"
                      value={formData.representativeTwo}
                      onChange={handleInputChange}
                      required
                      className="rounded-full border border-gray-200 px-4 py-3"
                      placeholder="Representative 2"
                    />
                  </div>
                </div>
              )}

              {/* Payment */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Fee & Payment *</label>
                <div className="grid gap-3 md:grid-cols-[1fr,1fr]">
                  <input
                    type="text"
                    value={`${CITIZENSHIP_TYPES[citizenship].currency} ${selectedType.fee.toLocaleString()}`}
                    readOnly
                    className="rounded-full border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800"
                  />
                  <input
                    type="text"
                    name="paymentReference"
                    value={formData.paymentReference}
                    onChange={handleInputChange}
                    className="rounded-full border border-gray-200 px-4 py-3"
                    placeholder="Reference / Transaction ID"
                  />
                </div>
              </div>

              {/* File upload */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">Passport Photo *</label>
                <input
                  type="file"
                  name="passportPhoto"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full rounded-full border border-dashed border-gray-300 px-4 py-3"
                  required
                />
                <p className="col-span-full text-xs text-gray-500 sm:col-start-2">JPEG/PNG, max 2MB</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-red-500">
                  Payment Receipt *
                  <span className="block text-xs font-normal text-gray-500">Upload payment screenshot or PDF (max 5MB)</span>
                </label>
                <input
                  type="file"
                  name="paymentProof"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="w-full rounded-full border border-dashed border-gray-300 px-4 py-3"
                  required
                />
              </div>

              {/* Notes */}
              <div className="grid gap-4 sm:grid-cols-[160px,1fr]">
                <label className="text-sm font-semibold text-gray-700">Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3"
                  placeholder="Anything else we should know?"
                />
              </div>

              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                {statusMessage && <p className="text-sm text-green-600">{statusMessage}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-3 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Now'}
                </button>
              </div>
            </form>

            <aside className="rounded-2xl bg-blue-50 p-6 text-sm text-blue-900">
              <h2 className="text-lg font-semibold text-blue-900">Membership checklist</h2>
              <p className="mt-2 text-blue-800">
                Red items are mandatory inputs from the applicant. Blue items are generated automatically through the approval workflow.
              </p>

              <div className="mt-4 space-y-2">
                {requirementList.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-red-500">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {item}
                  </p>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-white/70 p-4 shadow-sm">
                <h3 className="text-md font-semibold text-blue-900">Approval Flow</h3>
                <ol className="mt-3 space-y-2 text-sm text-blue-800">
                  <li>1. Submit + auto-generate PDF acknowledgement</li>
                  <li>2. Treasurer validates receipt of payment</li>
                  <li>3. Secretary reviews and approves membership</li>
                  <li>4. Membership number is generated automatically</li>
                  <li>5. Membership ID card + confirmation email sent to applicant</li>
                </ol>
              </div>

              <div className="mt-6 rounded-2xl bg-white/70 p-4 shadow-sm">
                <h3 className="text-md font-semibold text-blue-900">Payment Guidance</h3>
                <p className="mt-2 text-sm text-blue-800">
                  Pay via UPI / IMPS / NEFT / RTGS / Payment Gateway and paste the transaction reference above. Our finance team will confirm the payment
                  before the Secretary approves the membership.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

