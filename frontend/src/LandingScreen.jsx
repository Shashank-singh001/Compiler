import React, { useEffect, useRef } from "react";
import "./LandingScreen.css";

const generateStars = (container, count = 100) => {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    container.appendChild(star);
  }
};

const LandingScreen = () => {
  const glowRef = useRef(null);
  const starsRef = useRef(null);

  useEffect(() => {
    if (starsRef.current) {
      starsRef.current.innerHTML = "";
      generateStars(starsRef.current, 150);
    }

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      if (glowRef.current) {
        glowRef.current.style.left = `${clientX}px`;
        glowRef.current.style.top = `${clientY}px`;
        glowRef.current.style.opacity = 1;
      }
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = 0;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="landing-container">
      <div className="stars-container" ref={starsRef}></div>
      <div className="glow-cursor" ref={glowRef}></div>
      <div className="landing-content">
        <h1 className="title">Welcome to CodeForge</h1>
        <p className="subtitle">Craft, compile, and conquer the code.</p>
      </div>
    </div>
  );
};

export default LandingScreen;
