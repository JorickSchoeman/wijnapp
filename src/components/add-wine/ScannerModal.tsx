import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface ScannerModalProps {
  mode: 'barcode' | 'label';
  onClose: () => void;
  onScanComplete: (result: string) => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ mode, onClose, onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    
    async function startCamera() {
      try {
        const constraints = {
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Camera access denied or not available");
      }
    }

    startCamera();

    // Automatic capture for simulation if real camera fails or for label mode
    const simulationTimer = setTimeout(() => {
      // For demo purposes, we automatically "capture" after 4s
      capture();
    }, 4000);

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      clearTimeout(simulationTimer);
    };
  }, []);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(false);
    
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
      
      // Stop the camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Pass the captured image to the parent
      onScanComplete(imageData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#000',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {/* Camera Feed */}
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Toolbar */}
        <div style={{ position: 'absolute', top: 40, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '0 24px' }}>
          <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <X size={24} />
          </button>
        </div>

        {/* Framing UI */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              {mode === 'barcode' ? (
                <div style={{ position: 'relative', width: '260px', height: '140px', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '16px', boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' }}>
                  <motion.div
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    style={{ position: 'absolute', left: -10, right: -10, height: '2px', background: 'var(--wine-gold)', boxShadow: '0 0 15px var(--wine-gold)' }}
                  />
                  {/* Corner brackets */}
                  <div style={{ position: 'absolute', width: '20px', height: '20px', borderTop: '4px solid white', borderLeft: '4px solid white', top: -4, left: -4, borderRadius: '4px 0 0 0' }} />
                  <div style={{ position: 'absolute', width: '20px', height: '20px', borderTop: '4px solid white', borderRight: '4px solid white', top: -4, right: -4, borderRadius: '0 4px 0 0' }} />
                  <div style={{ position: 'absolute', width: '20px', height: '20px', borderBottom: '4px solid white', borderLeft: '4px solid white', bottom: -4, left: -4, borderRadius: '0 0 0 4px' }} />
                  <div style={{ position: 'absolute', width: '20px', height: '20px', borderBottom: '4px solid white', borderRight: '4px solid white', bottom: -4, right: -4, borderRadius: '0 0 4px 0' }} />
                </div>
              ) : (
                <div style={{ position: 'relative', width: '280px', height: '360px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '24px', boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' }}>
                   <motion.div
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    style={{ position: 'absolute', left: 0, right: 0, height: '100px', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.2), transparent)' }}
                  />
                  <div style={{ position: 'absolute', width: '30px', height: '30px', borderTop: '4px solid white', borderLeft: '4px solid white', top: -4, left: -4, borderRadius: '8px 0 0 0' }} />
                  <div style={{ position: 'absolute', width: '30px', height: '30px', borderTop: '4px solid white', borderRight: '4px solid white', top: -4, right: -4, borderRadius: '0 8px 0 0' }} />
                  <div style={{ position: 'absolute', width: '30px', height: '30px', borderBottom: '4px solid white', borderLeft: '4px solid white', bottom: -4, left: -4, borderRadius: '0 0 0 8px' }} />
                  <div style={{ position: 'absolute', width: '30px', height: '30px', borderBottom: '4px solid white', borderRight: '4px solid white', bottom: -4, right: -4, borderRadius: '0 0 8px 0' }} />
                </div>
              )}

              <div style={{ marginTop: '40px', background: 'rgba(0,0,0,0.6)', padding: '12px 24px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
                <p style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                  {mode === 'barcode' ? 'Scan de streepjescode op de fles' : 'Scan het vooretiket van de wijn'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div style={{ position: 'absolute', inset: 0, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'white', marginBottom: '20px' }}>{error}</p>
            <button onClick={onClose} style={{ color: 'var(--wine-gold)', fontWeight: 700 }}>Terug</button>
          </div>
        )}

        {/* Capture Button (Visible when scanning) */}
        {isScanning && !error && (
            <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={capture}
                    style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', background: 'white', 
                        border: '6px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'white', border: '2px solid black' }} />
                </motion.button>
            </div>
        )}

        {/* Processing State */}
        {!isScanning && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ marginBottom: '24px' }}>
              <Loader2 size={64} color="var(--wine-gold)" />
            </motion.div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>Label scannen...</h2>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ScannerModal;
