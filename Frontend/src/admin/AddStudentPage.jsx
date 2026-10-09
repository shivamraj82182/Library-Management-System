import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/AuthContext";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  department: "",
  stream: "",
  semester: "Semester 1",
  year: "1st Year",
  rollNo: "",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid #d9ded8",
  borderRadius: "10px",
  background: "#fff",
  color: "#18372c",
  outline: "none",
  fontSize: "14px",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#29483c",
  fontSize: "13px",
  fontWeight: 600,
};

const fieldStyle = { minWidth: 0 };

export default function AddStudentPage() {
  const { createStudentByAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (!createStudentByAdmin) {
      setMessage("Student creation function is missing from AuthContext.");
      setMessageType("error");
      return;
    }

    const phone = form.phone.replace(/\D/g, "");
    if (phone.length !== 10) {
      setMessage("Please enter a valid 10-digit phone number.");
      setMessageType("error");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createStudentByAdmin({
        ...form,
        email: form.email.trim().toLowerCase(),
        phone,
      });

      if (!result?.ok) {
        setMessage(result?.error || "Could not create the student.");
        setMessageType("error");
        return;
      }

      setMessage(result.message || "Student created successfully.");
      setMessageType("success");
      setForm(initialForm);
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ maxWidth: 1000, margin: "0 auto", color: "#18372c" }}>
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            margin: "0 0 8px",
            color: "#9a7833",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Library Office / Student Records
        </p>
        <h1
          style={{
            margin: 0,
            color: "#18372c",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 500,
          }}
        >
          Add a Student
        </h1>
        <p style={{ margin: "10px 0 0", color: "#738078", lineHeight: 1.6 }}>
          Create a student account and add their academic details to the library system.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: "clamp(18px, 3vw, 30px)",
          border: "1px solid #e7e5dc",
          borderRadius: 22,
          background: "#fffdf8",
          boxShadow: "0 12px 35px rgba(24, 55, 44, 0.06)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: 20,
          }}
        >
          <div style={fieldStyle}>
            <label htmlFor="name" style={labelStyle}>Full name *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Kumar" autoComplete="name" required style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>Email address *</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@example.com" autoComplete="email" required style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="phone" style={labelStyle}>Phone number *</label>
            <input id="phone" name="phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" autoComplete="tel" required style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>Initial password *</label>
            <input id="password" name="password" type="password" minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" autoComplete="new-password" required style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="department" style={labelStyle}>Department</label>
            <input id="department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="stream" style={labelStyle}>Course / Stream</label>
            <input id="stream" name="stream" value={form.stream} onChange={handleChange} placeholder="e.g. B.Tech CSE" style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="semester" style={labelStyle}>Semester</label>
            <select id="semester" name="semester" value={form.semester} onChange={handleChange} style={inputStyle}>
              {Array.from({ length: 8 }, (_, index) => `Semester ${index + 1}`).map((semester) => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="year" style={labelStyle}>Academic year</label>
            <select id="year" name="year" value={form.year} onChange={handleChange} style={inputStyle}>
              {["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
            <label htmlFor="rollNo" style={labelStyle}>Roll number</label>
            <input id="rollNo" name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="Enter college roll number" style={inputStyle} />
          </div>
        </div>

        {message && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 22,
              padding: "12px 14px",
              borderRadius: 10,
              fontSize: 14,
              lineHeight: 1.5,
              color: messageType === "success" ? "#17613e" : "#9a2929",
              background: messageType === "success" ? "#eaf7ef" : "#fff0f0",
              border: `1px solid ${messageType === "success" ? "#c5e8d0" : "#f2cccc"}`,
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 26,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            style={{
              padding: "12px 18px",
              border: "1px solid #d9ded8",
              borderRadius: 10,
              color: "#29483c",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              background: submitting ? "#789084" : "#18372c",
              cursor: submitting ? "wait" : "pointer",
              fontWeight: 700,
              opacity: submitting ? 0.8 : 1,
            }}
          >
            {submitting ? "Creating student..." : "Create Student"}
          </button>
        </div>
      </form>
      <p style={{ marginTop: 14, color: "#7b857f", fontSize: 12, lineHeight: 1.6 }}>
        Note: The student account is created as verified by the admin. Share the initial password securely with the student.
      </p>
    </section>
  );
}
