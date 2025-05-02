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
  const destinationUrl = 'https://www.multanihalwadelights.ca/';

  const handleFirstVideoEnded = () => {
    setCurrentVideo(2);
  };

  const handleSecondVideoEnded = () => {
    setCurrentVideo(1);
  };

  useEffect(() => {
    const handleBodyClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (containerRef.current) {
          requestFullScreen(containerRef.current);
        }
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
            muted
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
            muted
            onEnded={handleSecondVideoEnded}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        )}

        {/* Take me to website button */}
        <a
          href={destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#ffffffcc',
            color: '#000',
            padding: '14px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            zIndex: 10000,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          Take me to website
        </a>
      </div>
    </>
  );
}
