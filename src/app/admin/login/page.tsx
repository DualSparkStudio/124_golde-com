"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: "4px",
          padding: "2.5rem",
        }}
      >
        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.875rem",
            fontWeight: 600,
            color: "#c9a84c",
            textAlign: "center",
            marginBottom: "0.5rem",
            letterSpacing: "0.02em",
          }}
        >
          Admin Login
        </h1>
        <p
          style={{
            color: "#6b6b6b",
            textAlign: "center",
            fontSize: "0.875rem",
            marginBottom: "2rem",
          }}
        >
          Sign in to manage your jewelry store
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                color: "#a0a0a0",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "2px",
                color: "#e8e8e8",
                padding: "0.75rem 1rem",
                fontSize: "0.9375rem",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#c9a84c";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a";
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                color: "#a0a0a0",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "2px",
                color: "#e8e8e8",
                padding: "0.75rem 1rem",
                fontSize: "0.9375rem",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#c9a84c";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a";
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              role="alert"
              style={{
                color: "#e05252",
                fontSize: "0.875rem",
                marginBottom: "1.25rem",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#8a6f2e" : "#c9a84c",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "2px",
              padding: "0.875rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#b8943e";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#c9a84c";
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
