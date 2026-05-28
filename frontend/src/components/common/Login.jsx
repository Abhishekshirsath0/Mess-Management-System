import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // Example admin login
    if (
      formData.email === "admin@gmail.com" &&
      formData.password === "123456"
    ) {
      navigate("/admin");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Mess Management"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-12 w-auto"
        />

        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>

        <p className="mt-2 text-center text-sm text-gray-400">
          Mess Management System
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Email address
            </label>

            <div className="mt-2">
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white border border-gray-700 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-200">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </Link>
            </div>

            <div className="mt-2">
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white border border-gray-700 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Signup */}
        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}