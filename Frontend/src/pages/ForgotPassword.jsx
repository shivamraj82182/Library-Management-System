import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  UserRound,
  LockKeyhole,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

const API_URL = "https://library-management-system-etkk.onrender.com/api/auth";

const roleChoices = [
  {
    value: "user",
    label: "Student",
    icon: UserRound,
  },
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheck,
  },
];

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    role: "user",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError("");
    setMessage("");

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Step 1 - Send OTP
  const handleSendOtp = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          role: form.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to send OTP.");
        setLoading(false);
        return;
      }

      setMessage("OTP sent successfully to your email.");
      setStep(2);
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 + Step 3 - Reset password
  const handleResetPassword = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!form.newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          role: form.role,
          otp: form.otp.trim(),
          newPassword: form.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to reset password.");
        setLoading(false);
        return;
      }

      setMessage("Password reset successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-7 text-white">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white mb-5"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <KeyRound size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Forgot Password?</h1>
              <p className="text-sm text-white/80">
                Reset your library account password
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-7 pt-6">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 flex-1 rounded-full ${
                step >= 1 ? "bg-emerald-500" : "bg-gray-200"
              }`}
            />

            <div
              className={`h-2 flex-1 rounded-full ${
                step >= 2 ? "bg-emerald-500" : "bg-gray-200"
              }`}
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {step === 1
              ? "Step 1 of 2 — Verify your account"
              : "Step 2 of 2 — Create new password"}
          </p>
        </div>

        <div className="p-7">
          {/* Messages */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose account type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {roleChoices.map((choice) => {
                    const Icon = choice.icon;

                    return (
                      <label
                        key={choice.value}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition ${
                          form.role === choice.value
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={choice.value}
                          checked={form.role === choice.value}
                          onChange={handleChange}
                          className="hidden"
                        />

                        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                          <Icon size={17} />
                          {choice.label}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <p className="text-sm text-gray-600">
                  OTP sent to
                </p>

                <p className="font-semibold text-gray-900 mt-1 break-all">
                  {form.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  OTP
                </label>

                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  inputMode="numeric"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center tracking-[0.5em] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setMessage("");
                  setForm((current) => ({
                    ...current,
                    otp: "",
                  }));
                }}
                className="w-full text-sm text-gray-500 hover:text-emerald-600"
              >
                Change email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;