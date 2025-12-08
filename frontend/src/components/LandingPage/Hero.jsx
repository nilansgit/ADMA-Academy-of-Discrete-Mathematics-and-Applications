export default function Hero({ onRegisterNowClick }) {
  return (
    <section className="w-full bg-gradient-to-r from-yellow-50 to-amber-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8">
        {/* Left copy */}
        <div>
          <div className="mb-4 flex items-center gap-2 text-yellow-500">
            <span className="text-2xl">✶</span>
            <span className="text-2xl">+</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            Simplifying Excellence
            <br />
            in Mathematics
            <br />
            Community
          </h1>
          <div className="mt-4 h-2 w-60 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300" />
          <p className="mt-4 max-w-md text-xl text-gray-600">
            Join ADMA seamlessly – Apply, Pay,
            and Connect with ease
          </p>
          <div className="mt-6">
            <button
              onClick={onRegisterNowClick}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register Now
            </button>
          </div>
        </div>

        {/* Right illustration */}
        <div className="relative">
          <img
            src="/profreading.png"
            alt="Scholar reading with books and globe"
            className="mx-auto max-h-[500px] w-auto object-contain"
          />
          {/* Optional subtle shadow base for image */}
          <div className="pointer-events-none absolute -bottom-2 left-1/2 h-3 w-2/3 -translate-x-1/2 rounded-full bg-black/5 blur" />
        </div>
      </div>
    </section>
  )
}


