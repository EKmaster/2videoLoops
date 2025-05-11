'use client'
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

function requestFullScreen(elem: HTMLElement) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if ((elem as any).webkitRequestFullscreen) {
    (elem as any).webkitRequestFullscreen();
  } else if ((elem as any).mozRequestFullScreen) {
    (elem as any).mozRequestFullScreen();
  } else if ((elem as any).msRequestFullscreen) {
    (elem as any).msRequestFullscreen();
  }
}

export default function Home() {
  const [videoURLs, setVideoURLs] = useState<(string | null)[]>([null, null]);
  const [currentVideo, setCurrentVideo] = useState<0 | 1>(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length >= 2) {
      const urls = [URL.createObjectURL(files[0]), URL.createObjectURL(files[1])];
      setVideoURLs(urls);
      setCurrentVideo(0);
    }
  };

  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev === 0 ? 1 : 0));
  };

  useEffect(() => {
    const handleInteraction = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a')) return;

      if (!hasInteracted) {
        setHasInteracted(true);
        if (containerRef.current) {
          requestFullScreen(containerRef.current);
        }
      }

      const ref = videoRef.current;
      if (ref && videoURLs[0] && videoURLs[1]) {
        ref.pause();
        ref.currentTime = 0;
        ref.play().catch((err) => console.warn("Video play error:", err));
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted, videoURLs]);

  useEffect(() => {
    if (videoRef.current && videoURLs[0] && videoURLs[1]) {
      videoRef.current.src = videoURLs[currentVideo]!;
      videoRef.current.play().catch((err) => console.warn("Video play error:", err));
    }
  }, [currentVideo, videoURLs]);

  return (
    <>
      <Head>
        <title>Upload & Loop Videos</title>
        <meta name="description" content="User-uploaded fullscreen looping videos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          zIndex: 9999,
        }}
      >
        {!videoURLs[0] || !videoURLs[1] ? (
          <div style={{
            color: 'white',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <h2>Upload Two Videos to Start</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundColor: '#444',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Upload Videos
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            key={currentVideo}
            className="fullscreen-video"
            src={videoURLs[currentVideo]!}
            playsInline
            controls={false}
            onEnded={handleVideoEnded}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFilesSelected}
          style={{ display: 'none' }}
        />

        {/* External links (optional) */}
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
            zIndex: 10000,
            transition: 'transform 0.2s ease',
          }}
        >
          Visit Toronto Chocolate
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
            zIndex: 10000,
            transition: 'transform 0.2s ease',
          }}
        >
          Visit Multani Halwa
        </a>
      </div>
    </>
  );
}
