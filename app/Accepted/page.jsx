"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Accepted() {
  const [pin, setPin] = useState("");
  const [shaking, setShaking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);
  const correctPin = "!!2!!231";

  const handlePinChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 8);
    setPin(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Return" || e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (pin === correctPin) {
      alert("directing to secret page");
      // You can add redirect here later
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPin(""); // Clear the input
    }
  };

  useEffect(() => {
    setMounted(true);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans" style={{
      background: 'linear-gradient(135deg, #ffd6e0 0%, #ffb3c1 25%, #ff9aa2 50%, #ff8aa2 75%, #d0003a 100%)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }}>
      <div className="hearts-container" aria-hidden="true">
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
      </div>

      <div className={`text-center z-10 ${shaking ? "shake" : ""} ${mounted ? "grand-entrance" : ""}`}>
        <h1 className="secret-title title-pop">Find the Secret Code</h1>

        <div className="flex gap-4 justify-center mb-10 boxes-cascade">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="pin-input-box"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {pin[i] || ""}
            </div>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={pin}
          onChange={handlePinChange}
          onKeyDown={handleKeyDown}
          className="opacity-0 absolute w-0 h-0"
          maxLength="8"
          autoComplete="off"
        />

        <button
          onClick={handleSubmit}
          className="secret-submit-btn"
        >
          Unlock 🔐
        </button>

        <p className="text-gray-600 text-lg mt-6 font-semibold">Type or paste the 8-digit code</p>
      </div>
    </div>
  );
}