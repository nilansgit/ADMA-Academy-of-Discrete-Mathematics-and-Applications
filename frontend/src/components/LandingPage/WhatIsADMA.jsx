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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi molestie sapien id felis feugiat pharetra. Donec ac libero non velit bibendum pretium at vitae quam. Cras vel convallis tellus. Donec lobortis neque ut mattis vulputate. Ut pellientesque ligula aliquam leo tincidunt iaculis. Donec vel leo at augue faucibus commodo. Nulla a leo turpis. Pellentesque fringilla tellus in urna placerat posuere. Aliquam vitae turpis at turpis aliquet dapibus eget dapibus.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

