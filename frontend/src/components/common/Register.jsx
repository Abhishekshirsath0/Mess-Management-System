import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {postUserdata} from "../../service";

export default function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    mobile: "",
    parentMobile: "",
    email: "",
    address: "",
    gender: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const result = await postUserdata(formData);
    console.log(result);
    alert("Registration Successful!");

    navigate("/login");

    setFormData({
      fullname: "",
      mobile: "",
      parentMobile: "",
      email: "",
      address: "",
      gender: "",
      password: "",
      confirmPassword: "",
      terms: false,
    });
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 antialiased">
      <div className="w-full max-w-lg">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
          
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white text-2xl font-black tracking-wider shadow-md shadow-black/20">
              M
            </div>
            <h1 className="mt-5 text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an Account
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Register for Mess Management System
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none"
              />
            </div>

            {/* Mobile Numbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mobile" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="parentMobile" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Parent Mobile
                </label>
                <input
                  type="tel"
                  id="parentMobile"
                  name="parentMobile"
                  value={formData.parentMobile}
                  onChange={handleChange}
                  placeholder="Enter parent mobile"
                  required
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your residential address"
                required
                className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none resize-none"
              ></textarea>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none appearance-none"
              >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Password Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                required
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 select-none cursor-pointer">
                I accept the{" "}
                <a href="#" className="font-semibold text-black hover:underline underline-offset-2">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 mt-2 text-sm font-bold text-white bg-black rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all shadow-md shadow-black/10 tracking-wide"
            >
              Create Account
            </button>
          </form>

          {/* Login Redirection Link */}
          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="ml-1 font-bold text-black hover:underline underline-offset-2"
            >
              Login here
            </Link>
          </div>
          
        </div>
      </div>
    </main>
  );
}