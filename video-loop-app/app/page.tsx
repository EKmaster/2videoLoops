'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(1);
  const [showMessage, setShowMessage] = useState(true);
  const video1Ref = useRef<HTMLVideoElement | null>(null);
const video2Ref = useRef<HTMLVideoElement | null>(null);

const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const websiteUrl = "https://www.multanihalwadelights.com/"; // Replace with your target website URL

  // Function to reset the application state
  const resetApp = () => {
    setCurrentVideo(1);
    setShowMessage(true);
    
    if (video1Ref.current) {
      video1Ref.current.currentTime = 0;
      video1Ref.current.play();
    }
    
    if (video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.pause();
    }
  };

  // Track user activity
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current !== null) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    inactivityTimerRef.current = setTimeout(() => {
      resetApp();
    }, 20000);
  };
  

  // Handle video 1 ending
  const handleVideo1End = () => {
    setCurrentVideo(2);
    if (video2Ref.current) {
      video2Ref.current.play();
    }
  };

  // Handle video 2 ending
  const handleVideo2End = () => {
    setCurrentVideo(1);
    if (video1Ref.current) {
      video1Ref.current.play();
    }
  };

  // Handle message click
  const handleMessageClick = () => {
    window.open(websiteUrl, '_blank');
  };

  // Set up event listeners for user activity
  useEffect(() => {
    // Initial setup
    if (video1Ref.current) {
      video1Ref.current.play();
    }

    // Set up event listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Start initial inactivity timer
    resetInactivityTimer();

    // Clean up event listeners
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimerRef.current !== null) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center">
      {/* Videos Container */}
      <div className="flex w-full max-w-6xl justify-center items-center">
        {/* Video 1 */}
        <video
          ref={video1Ref}
          className={`w-1/2 object-contain transition-opacity duration-500 ${
            currentVideo === 1 ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          playsInline
          onEnded={handleVideo1End}
        >
          <source src="/video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
  
        {/* Video 2 */}
        <video
          ref={video2Ref}
          className={`w-1/2 object-contain transition-opacity duration-500 ${
            currentVideo === 2 ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          playsInline
          onEnded={handleVideo2End}
        >
          <source src="/video2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
  
      {/* Message Container */}
      {showMessage && (
        <div className="mt-8 cursor-pointer text-center" onClick={handleMessageClick}>
          <h2 className="text-4xl text-cyan-600 underline">Click Here to Visit Our Website</h2>
        </div>
      )}
    </main>
  );
  
}