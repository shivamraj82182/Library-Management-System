import React, { useState, useEffect } from 'react'
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { loginStyles as s } from '../assets/dummyStyles'
import { Lock, LockKeyhole, Mail, UserRound, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../shared/AuthContext";

const roleChoices = [
  { value: "user", label: "Student", icon: UserRound },
  { value: "admin", label: "Admin", icon: ShieldCheck },

];

const Login = () => {
  const { login, setGoogleUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.signupEmail || location.state?.signupPassword) {
      setForm((current) => ({
        ...current,
        email: location.state?.signupEmail ?? "",
        password: location.state?.signupPassword ?? "",
      }));
    }
  }, [location.state]);  //to see the field input

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setForm((current) => ({ ...current, [name]: value }));
  };
  // to submit the data to server and get the user/admin ligged in
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Attempting login with:", {
        email: form.email,
        role: form.role,
      });
      const result = await login(form);
      console.log("Login result:", result);

      if (!result.ok) {
        setLoading(false);
        setError(result.error || "Login failed");
        console.error("Login failed:", result.error);
        return;
      }

      console.log("Login successful, navigating to dashboard...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading(false);

      const fallbackPath =
        form.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      let target = location.state?.from || fallbackPath;

      if (
        form.role === "user" &&
        typeof target === "string" &&
        target.startsWith("/admin")
      ) {
        console.warn(
          "Login: preventing navigation to admin route for student; using fallback",
        );
        target = fallbackPath;
      } else if (
        form.role === "admin" &&
        typeof target === "string" &&
        target.startsWith("/user")
      ) {
        console.warn(
          "Login: preventing navigation to user route for admin; using fallback",
        );
        target = fallbackPath;
      }

      console.log("Navigating to:", target);
      navigate(target, { replace: true });

    } catch (err) {
      setLoading(false);
      console.error("Login Error:", err);
      setError("An unexpected connection error occurred.");
    }
  };
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Google login only for students
      if (form.role !== "user") {
        setError("Google login is available for students only.");
        setLoading(false);
        return;
      }

      // 1. Login with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);

      const googleUser = result.user;

      console.log("Google Login Successful:", {
        name: googleUser.displayName,
        email: googleUser.email,
        photo: googleUser.photoURL,
        uid: googleUser.uid,
      });

      // 2. Get Firebase ID Token
      const idToken = await googleUser.getIdToken();

      console.log("Firebase ID Token received");

      // 3. Send Firebase token to backend
      const response = await fetch(
        "http://localhost:5000/api/auth/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken,
          }),
        }
      );

      const data = await response.json();

      console.log("Backend Google Login Response:", data);

      // 4. Check backend response
      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Google login failed"
        );
      }

      // 5. Save YOUR backend JWT
      localStorage.setItem("token", data.token);

      // 6. Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // 7. Save Google user information
      localStorage.setItem(
        "googleUser",
        JSON.stringify({
          uid: googleUser.uid,
          name: googleUser.displayName,
          email: googleUser.email,
          photo: googleUser.photoURL,
        })
      );

      console.log("Backend JWT saved successfully");

      setLoading(false);

      // 8. Profile not complete → complete profile
      if (!data.user.isProfileComplete) {
        navigate("/user/complete-profile", {
          replace: true,
        });
        return;
      }

      // 9. Profile complete → dashboard
      navigate("/user/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error("Google Login Error:", error);

      setLoading(false);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Google login cancelled.");
      } else {
        setError(
          error.message || "Google login failed."
        );
      }
    }
  };



  return (
    <div className={s.pageContainer}>
      <div className={s.mainCard}>
        <section className={s.infoPanel}>
          <span className={s.roleBadge}>College role login</span>
          <h1 className={s.infoBoxTitle}>
            Choose student or admin first, then open the correct library panel.

          </h1>
          <p className={s.infoDescription}>
            Select the role you want to enter, then login with the matching

          </p>
          <div className={s.infoBoxesContainer}>
            <div className={s.infoBox}>
              <p className={s.infoBoxTitle}>
                <UserRound size={16} />
                Student Sign In

              </p>
              <p className={s.infoBoxText}>
                Register a new student account using the "Create account" link to test student
                to test student functionality with real data.

              </p>
            </div>
            <div className={s.infoBox}>
              <p className={s.infoBoxTitle}>
                <ShieldCheck size={16} />
                Admin Access

              </p>
              <p className={s.infoBoxText}>
                Log in using your Registered admin account to access the
                administrative dashboard and catalog features.
              </p>
            </div>
          </div>
        </section>
        <section className={s.formPanel}>
          <div className={s.formInner}>
            <Link
              to='/'
              className={s.backLink}
            >
              Back to Home
            </Link>
            <h2 className={s.formTitle}> Login Account </h2>
            <p className={s.formSubtitle}>
              Select your role and use your collage library account credentials.

            </p>
            <form className={s.form} onSubmit={handleSubmit}>
              <div className={s.roleContainer}>
                <p className={s.roleLabel}>Choose login role </p>
                <div className={s.roleGrid}>
                  {roleChoices.map((choice) => {
                    const Icon = choice.icon;
                    return (
                      <label
                        key={choice.value}
                        className={`${s.roleOption}
                          ${form.role === choice.value
                            ? s.roleOptionSelected
                            : s.roleOptionUnselected
                          }`}
                      >
                        <input type="radio" name="role" value={choice.value}
                          checked={form.role === choice.value}
                          onChange={handleChange}
                          className={s.roleRadio}
                        />
                        <span className={s.roleIconLabel}>
                          <Icon size={16} />
                          {choice.label}
                        </span>
                      </label>
                    );
                  })}

                </div>
              </div>
              <label className="block">
                <span className={s.fieldLabel}>
                  <Mail size={15} />
                  Email Address
                </span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@campus.edu"
                  className={s.input}
                />
              </label>

              <label className="block">
                <span className={s.fieldLabel}>
                  <LockKeyhole size={15} />
                  Password
                </span>
                <div className={s.passwordWrapper}>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    className={s.passwordInput}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className={s.togglePasswordButton}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}

                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-emerald-700 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </label>

              {error && (<div className={s.errorMessage}>{error}</div>)}

              <div className={s.footerFlex}>
                <span className={s.footerText}>
                  {form.role === "admin"
                    ? "Admin accounts use existing credentials"
                    : "Student signup is available below"}
                </span>

                {form.role === "user" && (
                  <Link to="/signup" className={s.signupLink}>
                    Create Account
                  </Link>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={s.submitButton}
              >
                {loading ? "Logging in..." : "Login now"}
                {!loading && <ArrowRight size={15} />}
              </button>
              {form.role === "user" && (
                <>
                  <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-300"></div>
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="h-px flex-1 bg-gray-300"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    <span className="text-lg font-bold">G</span>
                    {loading ? "Connecting..." : "Continue with Google"}
                  </button>
                </>
              )}

            </form>

          </div>

        </section>
      </div>
    </div>
  )
};

export default Login;
