import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
    // role: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (email,password) => {
    try{
      const url = new URL(`${BACKEND_URL}/auth/login`,window.location.origin)
      const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email,password})
      });
      const data = await res.json();

      if(!res.ok){
        alert(data.error)
      }

      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("role", data.role);

      navigate(`/dashboard/${data.role.toLowerCase()}`);

    }catch(err){
      console.error(err, "catch");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const {email, password} = formData;
    handleLogin(email,password);
  }

  // const roles = [
  //   'Select Role',
  //   "Treasurer",
  //   "Secretary"
  // ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-yellow-50 via-amber-50 to-beige-50 items-center justify-center p-12">
        <div className="relative max-w-md">
          <img
            src="/man-writing-desk.png"
            alt="Man writing at desk with books"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <a href="/" className="transition-transform hover:scale-105">
              <img src="/adma_logo.svg" alt="ADMA Logo" className="h-16 w-16" />
            </a>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Official Login</h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Select Role */}
            {/* <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-colors cursor-pointer"
                >
                  {roles.map((role) => (
                    <option key={role} value={role === 'Select Role' ? '' : role}>
                      {role}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div> */}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02]"
            >
              Login
            </button>
          </form>

          {/* Terms and Privacy */}
          <p className="mt-6 text-xs text-center text-gray-600 leading-relaxed">
            By continuing on account you agree to ADMA's{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
              Terms of Services
            </a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
              Privacy Policies
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

