import React from "react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <main className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-900 py-10">
      <div className="max-w-md w-full">
        <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-md md:p-8 dark:bg-neutral-800 dark:border-neutral-700">
          
          <h1 className="text-slate-900 text-center text-3xl font-bold dark:text-slate-50">
            Create an Account
          </h1>

          <p className="text-center text-sm text-slate-500 mt-2 dark:text-slate-400">
            Register for Mess Management System
          </p>

          <form className="space-y-5 mt-8">

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Full Name
              </label>

              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Enter full name"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-slate-50 dark:bg-neutral-700 dark:border-neutral-600"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobile"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Mobile Number
              </label>

              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="Enter mobile number"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-slate-50 dark:bg-neutral-700 dark:border-neutral-600"
              />
            </div>

            {/* Parent Mobile Number */}
            <div>
              <label
                htmlFor="parentMobile"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Parent Mobile Number
              </label>

              <input
                type="tel"
                id="parentMobile"
                name="parentMobile"
                placeholder="Enter parent mobile number"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-slate-50 dark:bg-neutral-700 dark:border-neutral-600"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-slate-50 dark:bg-neutral-700 dark:border-neutral-600"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                rows="3"
                placeholder="Enter your address"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-slate-50 dark:bg-neutral-700 dark:border-neutral-600"
              ></textarea>
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-slate-50 dark:bg-neutral-700 dark:border-neutral-600"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-slate-50 dark:bg-neutral-700 dark:border-neutral-600"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
              >
                Confirm Password
              </label>

              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="••••••••"
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-slate-50 dark:bg-neutral-700 dark:border-neutral-600"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1"
              />

              <label
                htmlFor="terms"
                className="text-sm text-slate-700 dark:text-slate-300"
              >
                I accept the{" "}
                <a
                  href="#"
                  className="text-blue-700 hover:underline dark:text-blue-500"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
            >
              Create an Account
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 text-slate-900 text-sm text-center dark:text-slate-50">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-700 hover:underline ml-1 font-medium dark:text-blue-500"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}