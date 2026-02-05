import { STRAPI_BASE_URL } from "../../constants";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Useful Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Useful Links :</h3>
            <ul className="space-y-2">
              <li>
                <a href="/login" className="hover:underline">Official Login</a>
              </li>
              <li>
                <a href={`${STRAPI_BASE_URL}`} target="_blank" className="hover:underline">Editor's Desk</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold">E-mail :</h3>
            <p className="mb-4">
              <a href="mailto:office@adma.co.in" className="hover:underline">
                office@adma.co.in
              </a>
            </p>
            <h3 className="mb-4 text-lg font-bold">Phone :</h3>
            <p>
              <a href="tel:0821-2302003" className="hover:underline">
                0821-2302003
              </a>
            </p>
          </div>

          {/* Address */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Address :</h3>
            <p className="leading-relaxed">
              Door No. 8/1, 13th Cross, Adipampa Road,<br />
              V.V.Mohalla, Mysore - 570002,<br />
              Karnataka, India
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-blue-500/30 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()}, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}

