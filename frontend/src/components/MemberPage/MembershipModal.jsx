import { useEffect, useCallback } from "react"

export default function MembershipModal({ isOpen, onClose, onApply }) {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, handleEscape])

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 min-h-screen overflow-y-auto overflow-x-hidden overscroll-contain backdrop-blur-md bg-black/50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="membership-modal-title"
    >
      <div
        className="relative w-full max-w-6xl my-4 sm:my-6 max-h-[90vh] min-h-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 ring-4 ring-black/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - always inside modal, 44px touch target on mobile */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white text-2xl sm:text-3xl font-bold min-w-[44px] min-h-[44px] w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/25 hover:bg-white/25 active:bg-white/35 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 touch-manipulation"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Single scroll area on mobile; side-by-side on desktop */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto md:overflow-hidden overscroll-contain">
          {/* Left Panel: Member Benefits */}
          <div className="w-full md:w-1/2 md:min-w-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center md:overflow-y-auto md:overscroll-contain shrink-0 md:shrink">
            <h2 id="membership-modal-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-6 md:mb-8">
              Member
            </h2>
            <ul className="space-y-2.5 sm:space-y-4 md:space-y-5 text-white text-sm sm:text-base md:text-lg lg:text-xl">
              {memberBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2.5 sm:gap-4">
                  <span className="text-yellow-300 text-lg sm:text-xl md:text-2xl font-bold flex-shrink-0 mt-0.5" aria-hidden>✓</span>
                  <span className="leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider on desktop */}
          <div className="hidden md:block w-px bg-white/20 flex-shrink-0" aria-hidden />

          {/* Right Panel: How to Apply */}
          <div className="w-full md:w-1/2 md:min-w-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-between md:overflow-y-auto md:overscroll-contain shrink-0 md:shrink">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-6 md:mb-8">
                How to Apply
              </h2>

              <ol className="space-y-2.5 sm:space-y-4 md:space-y-5 text-white text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-8 list-decimal list-inside">
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
            </div>

            <div className="mt-4 sm:mt-6 md:mt-auto pt-4 border-t border-white/20 md:border-t-0 md:pt-0 text-center">
              <button
                onClick={() => {
                  if (onApply) onApply()
                }}
                className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 min-h-[44px] text-base sm:text-lg font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-yellow-300/50 touch-manipulation"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

