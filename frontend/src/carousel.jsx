import React, { useState, useEffect, useRef } from "react";
import "./carousel.css";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs for tracking interaction
  const touchStartRef = useRef(0);
  const mouseStartRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const carouselRef = useRef(null);
  const autoRotateRef = useRef(null);
  const dragStartTimeRef = useRef(0);

  useEffect(() => {
    fetchCarouselAndOffers();
  }, []);

  const fetchCarouselAndOffers = async () => {
    try {
      setLoading(true);
      const [carouselRes, offersRes] = await Promise.all([
        fetch("http://localhost:5000/api/carousel"),
        fetch("http://localhost:5000/api/offers")
      ]);

      const carouselData = await carouselRes.json();
      const offersData = await offersRes.json();

      if (carouselData.success && carouselData.data.length > 0) {
        setSlides(carouselData.data);
      }
      if (offersData.success && offersData.data.length > 0) {
        setOffers(offersData.data);
      }
    } catch (error) {
      console.error("Error fetching carousel/offers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start auto-rotate carousel
  const startAutoRotate = () => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    if (slides.length === 0) return;
    autoRotateRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  // Stop and restart auto-rotate (called when user interacts)
  const resetAutoRotate = () => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    startAutoRotate();
  };

  // Pause auto-rotate temporarily during interaction
  const pauseAutoRotate = () => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
  };

  useEffect(() => {
    if (slides.length > 0) {
      startAutoRotate();
      return () => {
        if (autoRotateRef.current) clearInterval(autoRotateRef.current);
      };
    }
  }, [slides]);

  // ============ TOUCH HANDLERS (MOBILE) ============

  /**
   * Handle touch start on mobile devices
   * Records initial touch position and pauses autoplay
   */
  const handleTouchStart = (e) => {
    touchStartRef.current = e.targetTouches[0].clientX;
    dragDistanceRef.current = 0;
    dragStartTimeRef.current = Date.now();
    pauseAutoRotate();
  };

  /**
   * Handle touch movement on mobile devices
   * Provides real-time visual feedback during drag
   */
  const handleTouchMove = (e) => {
    if (!carouselRef.current) return;
    const currentX = e.targetTouches[0].clientX;
    const distance = currentX - touchStartRef.current;
    dragDistanceRef.current = distance;
    setDragOffset(distance);
  };

  /**
   * Handle touch end on mobile devices
   * Determines swipe direction and updates slide accordingly
   */
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const dragTime = Date.now() - dragStartTimeRef.current;
    handleSwipeEnd(touchStartRef.current, touchEnd, dragTime);
  };

  // ============ MOUSE HANDLERS (DESKTOP) ============

  /**
   * Handle mouse down on desktop
   * Initiates drag interaction and pauses autoplay
   */
  const handleMouseDown = (e) => {
    // Only left-click drag
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    mouseStartRef.current = e.clientX;
    dragStartTimeRef.current = Date.now();
    dragDistanceRef.current = 0;
    pauseAutoRotate();
  };

  /**
   * Handle mouse move on desktop
   * Provides smooth visual feedback during drag
   */
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const distance = currentX - mouseStartRef.current;
    dragDistanceRef.current = distance;
    setDragOffset(distance);
  };

  /**
   * Handle mouse up on desktop
   * Completes drag interaction and snaps to nearest slide
   */
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dragTime = Date.now() - dragStartTimeRef.current;
    handleSwipeEnd(mouseStartRef.current, e.clientX, dragTime);
  };

  /**
   * Handle mouse leave viewport while dragging
   * Ensures drag state is reset if mouse leaves window
   */
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const dragTime = Date.now() - dragStartTimeRef.current;
      handleSwipeEnd(mouseStartRef.current, mouseStartRef.current + dragDistanceRef.current, dragTime);
    }
  };

  // ============ SWIPE LOGIC ============

  /**
   * Core swipe handler with smart distance & velocity detection
   * Snaps to the nearest slide based on drag distance and speed
   */
  const handleSwipeEnd = (startX, endX, dragTime) => {
    // Reset visual drag offset
    setDragOffset(0);

    const distance = startX - endX;
    const velocity = Math.abs(distance) / dragTime; // pixels per millisecond

    const SWIPE_THRESHOLD = 30; // minimum pixels to trigger swipe
    const SWIPE_VELOCITY_THRESHOLD = 0.3; // minimum velocity (pixels/ms)

    const shouldSwipe =
      Math.abs(distance) > SWIPE_THRESHOLD ||
      velocity > SWIPE_VELOCITY_THRESHOLD;

    if (shouldSwipe) {
      setIsTransitioning(true);
      if (distance > 0) {
        // Swiped left (or fast swipe right) - move to next slide
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        // Swiped right (or fast swipe left) - move to previous slide
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
      resetAutoRotate();
      setTimeout(() => setIsTransitioning(false), 600);
    } else {
      // Not enough movement, resume autoplay
      resetAutoRotate();
    }
  };

  return (
    <>
      {slides.length > 0 ? (
        <div
          className="carousel-container"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: isDragging ? "none" : "auto",
          }}
        >
          <div className="carousel-wrapper">
          {/* Slides Container with smooth fade transitions */}
          <div className="carousel-slides">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
              >
                <img src={slide.image} alt={slide.title} />
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                aria-label={`Slide ${index + 1}`}
              ></span>
            ))}
          </div>
        </div>
      </div>
      ) : (
        <div className="carousel-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh", backgroundColor: "#000" }}>
          <p style={{ color: "#fff", fontSize: "18px" }}>Loading carousel...</p>
        </div>
      )}

      {/* Promotional Offers Bar */}
      {offers.length > 0 ? (
        <div className="offer-bar-container">
          <div className="offer-bar-content">
            {offers.map((offer, index) => (
              <span key={index} className="offer-item">
                {offer.title || offer}
              </span>
            ))}
            {/* Duplicate offers for seamless continuous loop */}
            {offers.map((offer, index) => (
              <span key={`dup-${index}`} className="offer-item">
                {offer.title || offer}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="offer-bar-container">
          <div className="offer-bar-content">
            <span className="offer-item">🎉 Special offers coming soon! Stay tuned for amazing deals.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;
