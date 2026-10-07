import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Clock, Copy, Check } from 'lucide-react';

export const HeroSlider = () => {
  const { banners, setSelectedCategory, applyCouponCode } = useEcommerce();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);

  // Flash Sale Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Slide auto-rotation
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentSlide];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCouponCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCta = (category) => {
    setSelectedCategory(category);
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-slider-section">
      <div className="container">
        <div 
          className="hero-slider-card"
          style={{ background: currentBanner.gradient }}
        >
          {/* Background Ambient Glow */}
          <div className="hero-ambient-glow" style={{ background: currentBanner.accentColor }} />

          <div className="hero-slide-grid">
            {/* Left Content */}
            <div className="hero-slide-content">
              <div className="hero-top-badges">
                <span className="hero-tag-badge">
                  <Sparkles size={14} />
                  {currentBanner.tag}
                </span>
                <span className="hero-discount-pill">{currentBanner.badge}</span>
              </div>

              <h1 className="hero-slide-title">{currentBanner.title}</h1>
              <p className="hero-slide-desc">{currentBanner.subtitle}</p>

              {/* Countdown Timer Block */}
              <div className="hero-flash-timer">
                <div className="flash-timer-label">
                  <Clock size={15} />
                  <span>FLASH PROMO ENDS IN:</span>
                </div>
                <div className="flash-countdown-boxes">
                  <div className="time-box">
                    <span className="time-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="time-unit">HOURS</span>
                  </div>
                  <span className="time-colon">:</span>
                  <div className="time-box">
                    <span className="time-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="time-unit">MINS</span>
                  </div>
                  <span className="time-colon">:</span>
                  <div className="time-box">
                    <span className="time-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="time-unit">SECS</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="hero-actions-row">
                <button 
                  className="hero-primary-btn"
                  onClick={() => handleCta(currentBanner.category)}
                >
                  <span>{currentBanner.ctaText}</span>
                  <ArrowRight size={18} />
                </button>

                <button 
                  className="hero-coupon-chip"
                  onClick={() => handleCopy(currentBanner.code)}
                  title="Click to copy & apply promo code"
                >
                  <span className="coupon-chip-text">CODE: <strong>{currentBanner.code}</strong></span>
                  {copiedCode === currentBanner.code ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="hero-slide-image-col">
              <div className="hero-image-frame">
                <img 
                  src={currentBanner.image} 
                  alt={currentBanner.title}
                  className="hero-main-img" 
                />
                <div className="hero-floating-card">
                  <div className="floating-card-rating">★★★★★ 4.9/5</div>
                  <div className="floating-card-text">Verified Global Guarantee</div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Arrow Controls */}
          <button 
            className="slider-nav-btn prev-btn"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button 
            className="slider-nav-btn next-btn"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots Indicator */}
          <div className="slider-dots">
            {banners.map((_, idx) => (
              <button
                key={idx}
                className={`dot-indicator ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
