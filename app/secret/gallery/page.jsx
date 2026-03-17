"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

// Placeholder image URLs (replace with your own)
const images = [
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/F0D7FD16-6901-40C0-8390-DE43B727E743_1_105_c.jpeg",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/CF78852C-2397-4FA1-9E95-B44328CA91F1_1_105_c.jpeg",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/8B082062-CEC1-420D-B72E-3E50BBD5FB25_1_105_c.jpeg",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/168CE808-6A5D-4184-920E-957EBDEF9CC8_1_105_c.jpeg",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/D8EC9971-F53B-4AE6-AE1D-98ADA08BA537_1_105_c.jpeg",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/01B0959E-9BAE-472E-BF84-FCBAE8F12B46_1_105_c.jpeg",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/EB686491-9364-47AA-93B3-D4BB7E5873A7_1_105_c.jpeg",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/99CFB7D3-E6B1-4874-B8AC-77B041360229_1_105_c.jpeg",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/11E7E0BA-A9F6-4A74-8C04-3AB9F186EBA3_1_105_c.jpeg",
     "https://ik.imagekit.io/z2pqzlrkg/valentines2026/IMG_3651.HEIC",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/IMG_4110%202.HEIC",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/IMG_5092.heic",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/IMG_5376.HEIC",
    "https://ik.imagekit.io/z2pqzlrkg/valentines2026/IMG_5211.HEIC",
];

export default function Gallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Number of sections
  const sectionCount = images.length;

  return (
    <main className="bg-black">
      {/* Spacer container to generate scroll height */}
      <div ref={containerRef} className="relative" style={{ height: `${sectionCount * 100}vh` }}>
        {/* Fixed tulip container (right side, centered) */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 w-32 h-64 pointer-events-none">
          <Tulip progress={scrollYProgress} />
        </div>

        {/* Sticky sections */}
        {images.map((src, index) => {
          // Define scroll range for this section: [i/n, (i+1)/n]
          const start = index / sectionCount;
          const end = (index + 1) / sectionCount;

          // Map scroll progress to horizontal slide (from 100% to 0%)
          const x = useTransform(scrollYProgress, [start, end], ["100%", "0%"], {
            clamp: false, // allow values outside range for smooth entry/exit
          });
          
// For the first image, make text appear when the slide is about 70% done
const textOpacity = useTransform(
  scrollYProgress,
  [start, start + (end - start) * 0.7, end],
  [1, 1, 0]
);

          return (
            <section
              key={index}
              className="sticky top-0 h-screen w-full overflow-hidden"
            >
              
            {index === 0 && (
  <motion.div
    className="absolute inset-0 flex items-center justify-center p-4"
    style={{ opacity: textOpacity }}
  >
    <h1 className="text-2xl font-bold text-white">
      you made it! welcome to our secret gallery
    </h1>
  </motion.div>
)}
              
              <motion.div
              
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${src})`,
                  x, // slide in from right
                }}
              />
            </section>
          );
        })}
      </div>
    </main>
  );
}

// Tulip SVG component that grows with scroll progress
function Tulip({ progress }) {
  // Interpolate progress to specific values
  const stemEndY = useTransform(progress, [0, 1], [90, 20]); // stem grows upward
  const leafScale = useTransform(progress, [0, 0.5, 1], [0, 0.8, 1]); // leaves appear by 50% scroll
  const flowerScale = useTransform(progress, [0.5, 1], [0, 1]); // flower blooms after half
  const flowerOpacity = useTransform(progress, [0.5, 0.7, 1], [0, 0.5, 1]);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Stem */}
      <motion.line
        x1="50"
        y1="90"
        x2="50"
        y2={stemEndY}
        stroke="#4ade80" // green-400
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Left leaf */}
      <motion.path
        d="M50,70 Q30,60 25,40"
        stroke="#4ade80"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        style={{ scale: leafScale, transformOrigin: "50px 70px" }}
      />

      {/* Right leaf */}
      <motion.path
        d="M50,70 Q70,60 75,40"
        stroke="#4ade80"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        style={{ scale: leafScale, transformOrigin: "50px 70px" }}
      />

      {/* Tulip flower (purple) */}
      <motion.g style={{ scale: flowerScale, opacity: flowerOpacity, transformOrigin: "50px 20px" }}>
        <path
          d="M50,20 Q40,5 30,20 Q40,30 50,20 Q60,30 70,20 Q60,5 50,20"
          fill="#c084fc" // purple-300
          stroke="#a855f7" // purple-500
          strokeWidth="2"
        />
        {/* Stamen (optional) */}
        <circle cx="50" cy="20" r="2" fill="#facc15" /> {/* yellow */}
      </motion.g>
    </svg>
  );
}