import React from "react";
import "./layout.css";

// PUBLIC_INTERFACE
export default function Header({ onToggleTheme, theme }) {
  /** App header with title, theme toggle, and API status hint area */
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-logo" aria-hidden>✅</span>
        <h1 className="brand-title">Task Organizer</h1>
      </div>
      <div className="header-actions">
        <button className="btn btn-secondary" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
}
