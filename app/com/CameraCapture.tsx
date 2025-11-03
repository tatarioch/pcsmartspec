"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  maxImages?: number;
  currentImageCount?: number;
}

export default function CameraCapture({
  onCapture,
  maxImages = 4,
  currentImageCount = 0,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDevice, setCurrentDevice] = useState<string | undefined>();
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const startStream = async (deviceId?: string) => {
    stopStream();
    const constraints: MediaStreamConstraints = {
      video: deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: "environment" },
    };

    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setStatus("Camera ready");
      setError("");
      const track = s.getVideoTracks()[0];
      setCurrentDevice(track.getSettings().deviceId);
    } catch (err: any) {
      console.error("Camera error:", err);
      setError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access in your browser settings."
          : err.name === "NotFoundError"
          ? "No camera found on your device."
          : "Unable to access camera. Please try again."
      );
      setStatus("");
      stopStream();
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.95);
  };

  const handleTakePhoto = async () => {
    if (currentImageCount >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setStatus("Capturing...");
    const dataUrl = await captureFrame();
    if (dataUrl) {
      onCapture(dataUrl);
      setStatus("Photo captured!");
      setTimeout(() => setStatus(""), 2000);
    } else {
      setError("Failed to capture photo");
      setStatus("");
    }
  };

  const handleStartCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera not supported in this browser");
      return;
    }

    setIsActive(true);
    setError("");

    // Enumerate devices first to get available cameras
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const cams = devs.filter((d) => d.kind === "videoinput");
      setDevices(cams);
      await startStream();
    } catch (err: any) {
      setError("Failed to access camera");
      setIsActive(false);
    }
  };

  const handleStopCamera = () => {
    stopStream();
    setIsActive(false);
    setStatus("");
    setError("");
  };

  const switchCamera = async () => {
    if (devices.length < 2) {
      setError("Only one camera available");
      return;
    }
    const currentIndex = devices.findIndex((d) => d.deviceId === currentDevice);
    const nextIndex = (currentIndex + 1) % devices.length;
    await startStream(devices[nextIndex].deviceId);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopStream();
  }, []);

  // If camera is not active, show button to start
  if (!isActive) {
    return (
      <div className="mb-4">
        <button
          type="button"
          onClick={handleStartCamera}
          disabled={currentImageCount >= maxImages}
          className="flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="h-4 w-4" />
          Take Photo with Camera
        </button>
        {currentImageCount >= maxImages && (
          <p className="mt-1 text-xs text-zinc-500">
            Maximum {maxImages} images reached
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 space-y-3 rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-700">Camera</h3>
        <button
          type="button"
          onClick={handleStopCamera}
          className="text-xs text-zinc-500 hover:text-zinc-700"
        >
          Close Camera
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {devices.length > 1 && (
        <button
          type="button"
          onClick={switchCamera}
          className="text-xs text-zinc-600 hover:text-zinc-800"
        >
          Switch Camera ({devices.length} available)
        </button>
      )}

      <div className="relative w-full bg-black rounded-lg overflow-hidden min-h-[400px]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full min-h-[400px] object-contain"
        />
        {!stream && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-400 min-h-[400px]">
            <div className="text-center">
              <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Starting camera...</p>
            </div>
          </div>
        )}
      </div>

      {status && (
        <p className="text-xs text-zinc-600 text-center">{status}</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleTakePhoto}
          disabled={!stream || currentImageCount >= maxImages}
          className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Capture Photo
        </button>
      </div>

      <p className="text-xs text-zinc-500 text-center">
        {currentImageCount}/{maxImages} photos added
      </p>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
