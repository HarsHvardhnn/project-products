import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

interface ParticipantViewProps {
  participantId: string;
  onTranscriptUpdate: (
    participantId: string,
    transcript: string,
    items: any[]
  ) => void;
  isSmallView?: boolean;
}

function ParticipantView({
  participantId,
  onTranscriptUpdate,
  isSmallView = false,
}: ParticipantViewProps) {
  const {
    displayName,
    webcamStream,
    micStream,
    screenShareStream,
    webcamOn,
    micOn,
    screenShareOn,
    isLocal,
  } = useParticipant(participantId);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [caption, setCaption] = useState<string>("");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const participantName = isLocal ? "You" : displayName;
  const initials = getInitials(participantName);

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      videoRef.current.srcObject = new MediaStream([webcamStream.track]);
    }
  }, [webcamStream]);

  useEffect(() => {
    if (micStream && audioRef.current && !isLocal) {
      const mediaStream = new MediaStream([micStream.track]);
      audioRef.current.srcObject = mediaStream;
      audioRef.current.play().catch((error) => {
        console.error("Audio playback error:", error);
      });
      return () => {
        if (audioRef.current) {
          audioRef.current.srcObject = null;
        }
      };
    }
  }, [micStream, isLocal]);

  useEffect(() => {
    if (micStream) {
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        setCaption(transcript);
        onTranscriptUpdate(participantId, transcript, []);
      };

      try {
        recognition.start();
      } catch (error) {
        console.error("Speech recognition error:", error);
      }

      return () => {
        recognition.stop();
      };
    }
  }, [micStream, participantId, onTranscriptUpdate]);

  const containerClasses = isSmallView
    ? "absolute bottom-0 right-0 w-48 h-36 rounded-lg overflow-hidden shadow-lg z-10"
    : "relative w-full h-full rounded-lg overflow-hidden flex flex-col";

  return (
    <div className={`${containerClasses} bg-gray-900`}>
      <div className="w-full h-full flex items-center justify-center relative">
        {webcamOn ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gray-700 rounded-full`}
          >
            <span
              className={`${
                isSmallView ? "text-lg" : "text-2xl"
              } font-medium text-white`}
            >
              {initials}
            </span>
          </div>
        )}
        <audio
          ref={audioRef}
          autoPlay
          playsInline
          controls={false}
          muted={isLocal}
        />
      </div>

      {/* Name overlay */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
        <span
          className={`text-white ${
            isSmallView ? "text-sm" : "text-lg"
          } font-medium`}
        >
          {participantName}
        </span>
      </div>

      {/* Camera off overlay */}
      {!webcamOn && (
        <div className="absolute top-2 right-2">
          <div className="p-1.5 rounded-lg bg-gray-800/50">
            <Camera
              className={`${isSmallView ? "w-4 h-4" : "w-5 h-5"} text-gray-400`}
            />
          </div>
        </div>
      )}

      {/* Captions */}
      {!isSmallView && micOn && caption && (
        <div className="absolute bottom-12 left-4 right-4">
          <div className="bg-gray-900/80 text-white p-2 rounded text-sm">
            {caption}
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantView;
