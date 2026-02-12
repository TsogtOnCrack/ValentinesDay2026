"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import montyPuppy from "./assets/monty.png";

export default function Home() {
  const router = useRouter();
  const noRef = useRef(null);
  const [firsttime, setFirsttime] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleYesClick = () => {
    if (firsttime === 0) {
      alert("try clicking 'no' first ❤️");
    } else {
      setIsLeaving(true);
      setTimeout(() => router.push("/Accepted"), 400);
    }
  }

  useEffect(() => {
    function explodeAt(x, y) {
      const container = document.querySelector(".hearts-container");
      if (!container) return;
      for (let i = 0; i < 12; i++) {
        const h = document.createElement("div");
        h.className = "explosion-heart";
        // scatter around the cursor
        h.style.left = `${x - 10 + Math.random() * 40 - 20}px`;
        h.style.top = `${y - 10 + Math.random() * 40 - 20}px`;
        h.style.setProperty("--dx", `${Math.random() * 200 - 100}px`);
        h.style.setProperty("--dy", `${-100 - Math.random() * 120}px`);
        container.appendChild(h);
        setTimeout(() => h.remove(),1100);
      }
    }

    function handleMove(e) {
      const btn = noRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const threshold = 30;
      if (dist < threshold && !btn.dataset.avoiding) {
        btn.dataset.avoiding = "1";
        explodeAt(e.clientX, e.clientY);
        setFirsttime(1);
        // hide temporarily and move to a random place
        btn.style.transition = "transform 0.18s ease, opacity 0.2s ease, left 0.1s ease, top 0.1s ease";
        btn.style.opacity = "0";
        btn.style.transform = "scale(0.7)";
        
        // Get viewport dimensions in px
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const btnW = rect.width || 80;
        const btnH = rect.height || 40;
        
        // Keep button within 100vw and 100vh with safety margin
        const newLeft = Math.max(0, Math.min(Math.floor(Math.random() * (vw - btnW))/2, vw - btnW));
        const newTop = Math.max(0, Math.min(Math.floor(Math.random() * (vh - btnH))/2, vh - btnH));
        
        // position fixed so it can move anywhere
        btn.style.position = "fixed";
        btn.style.left = `${newLeft}px`;
        btn.style.top = `${newTop}px`;
        setTimeout(() => {
          btn.style.opacity = "1";
          btn.style.transform = "";
          delete btn.dataset.avoiding;
        }, 300);
      }
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className={`flex min-h-screen items-center justify-center font-sans ${isLeaving ? "fade-out-transition" : ""}`}>
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

      <div className="valentine-wrapper">
        <div className="puppy-container">
          <Image 
            src={montyPuppy}
            alt="Cute puppy Monty"
            width={200}
            height={200}
            priority
            className="puppy-image"
          />
        </div>
        <div className="valentine-card" role="region" aria-label="Valentine message">
          <h1>Anu, Will you be my Valentine?</h1>
          {/* <p className="valentine-sub">✨ Choose wisely ✨</p> */}

          <div className="choice-row">
            <button className="choice-btn yes" onClick={() => handleYesClick()}>
              💕 Yes
            </button>
            <button className="choice-btn no" ref={noRef}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
