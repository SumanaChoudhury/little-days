import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, RefreshCw, Check, ArrowLeft, Flashlight, Image } from 'lucide-react';
import { MemoryPost, Story, UserProfile } from '../types';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (dataUrl: string, target: 'feed' | 'story') => void;
  profile: UserProfile;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
  profile
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setCameraError('Camera access not available or permission denied.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Flash animation
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // If front camera, mirror image for natural selfie feel
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleFlipCamera = () => {
    setFacingMode(f => (f === 'user' ? 'environment' : 'user'));
  };

  const handleSelectCaptured = (target: 'feed' | 'story') => {
    if (capturedImage) {
      onPhotoCaptured(capturedImage, target);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none animate-fade-in">
      <div className="relative w-full h-full max-w-md max-h-[95vh] sm:rounded-3xl overflow-hidden bg-neutral-950 flex flex-col justify-between">
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between text-white bg-gradient-to-b from-black/70 to-transparent">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider">MyMemories Camera</span>
          <button
            onClick={handleFlipCamera}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md"
            title="Flip Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder / Preview */}
        <div className="relative flex-1 w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : cameraError ? (
            <div className="p-6 text-center text-white">
              <Camera className="w-12 h-12 text-neutral-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">{cameraError}</p>
              <p className="text-xs text-neutral-400 mt-1 mb-4">
                Please allow camera access in browser permissions or pick an image.
              </p>
              <label className="px-4 py-2 rounded-lg bg-[#0095f6] text-white text-xs font-semibold cursor-pointer">
                Pick from gallery instead
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setCapturedImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
          )}

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Flash animation */}
          {isFlashing && <div className="absolute inset-0 bg-white z-40 pointer-events-none" />}
        </div>

        {/* Bottom Shutter / Action Controls */}
        <div className="p-6 bg-black text-white flex items-center justify-around z-30">
          {capturedImage ? (
            <div className="flex items-center justify-between w-full gap-3">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 text-xs font-semibold hover:bg-neutral-700"
              >
                Retake
              </button>
              <button
                onClick={() => handleSelectCaptured('story')}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-xs font-bold shadow-md hover:opacity-90"
              >
                Your Story
              </button>
              <button
                onClick={() => handleSelectCaptured('feed')}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0095f6] text-xs font-bold shadow-md hover:bg-sky-600"
              >
                Feed Post
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-around w-full">
              {/* Gallery button */}
              <label className="p-3 rounded-full bg-neutral-900 cursor-pointer hover:bg-neutral-800">
                <Image className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setCapturedImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {/* Shutter Button (Instagram style large white double circle) */}
              <button
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full border-4 border-white p-1 hover:scale-105 active:scale-95 transition-transform"
                title="Click Pic"
              >
                <div className="w-full h-full rounded-full bg-white active:bg-neutral-300" />
              </button>

              {/* Flip camera */}
              <button
                onClick={handleFlipCamera}
                className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
