'use client';
import { useRef, useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoURL(url);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      const videoEl = videoRef.current;
      if (!document.fullscreenElement) {
        videoEl.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err);
        });
      } else {
        document.exitFullscreen().catch((err) => {
          console.warn('Exiting fullscreen failed:', err);
        });
      }
    }
  };

  useEffect(() => {
    const handleBodyClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      const isLink = target.closest('a');
      if (isLink) return;

      if (!hasInteracted) {
        setHasInteracted(true);
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => {
          console.warn('Video play failed:', err);
        });
      }
    };

    document.addEventListener('click', handleBodyClick);
    document.addEventListener('touchstart', handleBodyClick);

    const audioMessage = new Audio('/click-for-fullscreen.mp3');
    audioMessage.play().catch((e) => {
      console.log('Auto-play error:', e);
    });

    return () => {
      document.removeEventListener('click', handleBodyClick);
      document.removeEventListener('touchstart', handleBodyClick);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (hasInteracted && videoRef.current && videoURL) {
      videoRef.current.play().catch((err) => {
        console.warn('Video play failed:', err);
      });
    }
  }, [hasInteracted, videoURL]);

  return (
    <>
      <Head>
        <title>Video Upload Viewer</title>
        <meta name="description" content="Play uploaded video without fullscreen" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div
        className="video-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'black',
          zIndex: 9999,
        }}
      >
        {!videoURL && (
          <div
            style={{
              color: 'white',
              textAlign: 'center',
              paddingTop: '40vh',
            }}
          >
            <h2>Upload Combined Video</h2>
            <input type="file" accept="video/*" onChange={handleVideoUpload} />
          </div>
        )}

        {videoURL && (
          <video
            ref={videoRef}
            src={videoURL}
            className="fullscreen-video"
            playsInline
            loop 
            controls={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        )}

        {/* Fullscreen Button */}
        {videoURL && (
          <button
            onClick={toggleFullscreen}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              zIndex: 10001,
            }}
            title="Toggle Fullscreen"
          >
            ⛶
          </button>
        )}

        {/* Visit Buttons */}
        <a
          href="https://www.torontochocolate.ca/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            backgroundColor: '#8B4513',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            zIndex: 10000,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Visit Toronto Chocolate Website
        </a>

        <a
          href="https://www.multanihalwadelights.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#870000',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            zIndex: 10000,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Visit Multani Halwa Website
        </a>
      </div>
    </>
  );
}
