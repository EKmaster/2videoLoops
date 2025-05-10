'use client'
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

function requestFullScreen(elem: HTMLElement) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if ((elem as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
    (elem as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
  } else if ((elem as unknown as { mozRequestFullScreen?: () => void }).mozRequestFullScreen) {
    (elem as unknown as { mozRequestFullScreen: () => void }).mozRequestFullScreen();
  } else if ((elem as unknown as { msRequestFullscreen?: () => void }).msRequestFullscreen) {
    (elem as unknown as { msRequestFullscreen: () => void }).msRequestFullscreen();
  }
}

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const secondVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Change this to your desired link

  const handleFirstVideoEnded = () => {
    setCurrentVideo(2);
  };

  const handleSecondVideoEnded = () => {
    setCurrentVideo(1);
  };

  useEffect(() => {
    const handleBodyClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      const isLink = target.closest('a');
    
      // Ignore clicks on links (like the website button)
      if (isLink) return;
    
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    
      if (containerRef.current) {
        requestFullScreen(containerRef.current);
      }
    
      if (currentVideo === 1 && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => {
          console.warn("Video 1 play failed:", err);
        });
      } else if (currentVideo === 2 && secondVideoRef.current) {
        secondVideoRef.current.pause();
        secondVideoRef.current.currentTime = 0;
        secondVideoRef.current.play().catch((err) => {
          console.warn("Video 2 play failed:", err);
        });
      }
    };
    
    

    document.addEventListener('click', handleBodyClick);
    document.addEventListener('touchstart', handleBodyClick);

    const audioMessage = new Audio('/click-for-fullscreen.mp3');
    audioMessage.play().catch((e) => {
      console.log("Auto-play error:", e);
    });

    return () => {
      document.removeEventListener('click', handleBodyClick);
      document.removeEventListener('touchstart', handleBodyClick);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (hasInteracted && videoRef.current && currentVideo === 1) {
      videoRef.current.play().catch((err) => {
        console.warn("Video 1 play failed:", err);
      });
    }
  }, [hasInteracted, currentVideo]);

  useEffect(() => {
    if (currentVideo === 2 && secondVideoRef.current) {
      secondVideoRef.current.play().catch((err) => {
        console.warn("Video 2 play failed:", err);
      });
    }
  }, [currentVideo]);

  useEffect(() => {
    if (containerRef.current) {
      // Re-trigger fullscreen when the component is re-rendered or comes back from another view
      requestFullScreen(containerRef.current);
    }
  }, [currentVideo]);  // This ensures fullscreen is triggered when we switch between videos

  return (
    <>
      <Head>
        <title>Fullscreen Video Player</title>
        <meta name="description" content="Fullscreen video player with auto-switching" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div 
        ref={containerRef} 
        className="video-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'black',
          zIndex: 9999
        }}
      >
        {!hasInteracted && (
          <div className="fullscreen-prompt">
            <h2>Click anywhere to start</h2>
            <p>Videos will play in fullscreen</p>
          </div>
        )}

        {currentVideo === 1 && (
          <video
            key="video1"
            ref={videoRef}
            src="/video1.mp4"
            className="fullscreen-video"
            playsInline
            controls={false}
            
            onEnded={handleFirstVideoEnded}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        )}

        {currentVideo === 2 && (
          <video
            key="video2"
            ref={secondVideoRef}
            src="/video2.mp4"
            className="fullscreen-video"
            playsInline
            controls={false}
            
            onEnded={handleSecondVideoEnded}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        )}

        {/* Take me to website button */}
        <>
  {/* Bottom Left Button */}
  <a
    href="https://www.torontochocolate.ca/"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      position: 'fixed',
      bottom: '40px',
      left: '40px',
      backgroundColor: '#8B4513', // brown
      color: '#fff',
      padding: '30px 60px',
      borderRadius: '20px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '28px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
      zIndex: 10000,
      transition: 'transform 0.2s ease',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  >
    Visit Toronto Chocolate Website
  </a>

  {/* Bottom Right Button */}
  <a
    href="https://www.multanihalwadelights.com/"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      position: 'fixed',
      bottom: '40px',
      right: '40px',
      backgroundColor: '#870000', // red
      color: '#fff',
      padding: '30px 60px',
      borderRadius: '20px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '28px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
      zIndex: 10000,
      transition: 'transform 0.2s ease',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  >
    Visit Multani Halwa Website
  </a>
</>



      </div>
    </>
  );
}
