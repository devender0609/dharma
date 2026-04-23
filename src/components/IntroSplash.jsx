
import { useEffect, useState } from "react";
import "../styles/introSplash.css";

export default function IntroSplash({ onDone }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onDone && onDone(), 600);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`intro-splash ${fadeOut ? "fade-out" : ""}`}>
      <div className="logo-container">
        <h1 className="title">Vedatime</h1>
        <p className="subtitle">Panchang • Festivals • AI</p>
      </div>
    </div>
  );
}
