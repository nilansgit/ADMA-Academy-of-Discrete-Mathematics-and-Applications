export default function MembershipModal({ isOpen, onClose, onApply }) {
  if (!isOpen) return null

  const memberBenefits = [
    "Access to IJDM digital archive",
    "Discounted conference registration fees",
    "Priority access to workshops and seminars",
    "Networking opportunity with peers",
    "Regular Update on Mathematics research",
    "Eligibility for ADMA fellowships and awards",
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/30 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[75vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 -right-4 z-10 text-white text-4xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Left Panel: Member Benefits */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Member</h2>
          <ul className="space-y-5 text-white text-lg md:text-xl">
            {memberBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="text-yellow-300 text-2xl font-bold flex-shrink-0 mt-1">✓</span>
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel: How to Apply */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">How to Apply</h2>
          
          <ol className="space-y-5 text-white text-lg md:text-xl mb-8 list-decimal list-inside">
            <li className="leading-relaxed">
              Complete the membership application form
            </li>
            <li className="leading-relaxed">
              Pay membership fee via bank transfer or demand draft
            </li>
            <li className="leading-relaxed">
              Await approval from the membership committee
            </li>
          </ol>

          {/* <div className="mb-8 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <p className="text-white text-base md:text-lg leading-relaxed">
              <span className="font-semibold">Annual Membership Fee:</span> INR 1500 for Indian residents, $50 for international members
            </p>
          </div> */}

          <div className="mt-auto text-center">
            <button
              onClick={() => {
                if (onApply) {
                  onApply()
                }
              }}
              className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

