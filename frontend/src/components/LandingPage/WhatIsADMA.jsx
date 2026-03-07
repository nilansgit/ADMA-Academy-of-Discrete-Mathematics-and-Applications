export default function WhatIsADMA() {
  return (
    <section className="w-full bg-gradient-to-r from-yellow-50 via-white to-yellow-50 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left illustration */}
        <div className="order-2 lg:order-1">
          <img
            src="/fivePeople.png"
            alt="Five professionals with books"
            className="mx-auto max-h-[400px] w-auto object-contain"
          />
        </div>

        {/* Right content card */}
        <div className="order-1 lg:order-2">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900">What is ADMA?</h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              The Academy of Discrete Mathematics and Applications (ADMA) is a registered professional body functioning with the aim of promoting active and quality research in Discrete Mathematics and allied subjects. Established in 2005, it has been successfully disseminating front-line research culture among the discrete mathematicians in India. Its annual conferences are being organized every year in the month of June so that the dates of the conference include June 10th as Graph Theory Day marking the birth anniversary of Professor E. Sampathkumar, the pioneer in introducing Graph Theory into the postgraduate curriculum in India during the academic year 1970-71 at the famed Karnatak University, Dharwad.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
