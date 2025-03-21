import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // React Router hook for accessing query params
import { MeetingConsumer, MeetingProvider } from "@videosdk.live/react-sdk";
import { generateToken } from "../utils/videosdk.js"; // Import your existing generateToken method
import { MeetingEntryModal } from "./MeetingEntryModal";
import { WelcomeMessage } from "./WelcomeMessage";
import MeetingRoom from "./MeetingRoom";
import { Meeting } from "@videosdk.live/react-sdk/dist/types/meeting.js";

export const TestMeetingEntry: React.FC = () => {
  const { id: meetingId } = useParams(); // Extract meeting ID from query parameters
  const [token, setToken] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);

  // Fetch token when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const generatedToken = await generateToken(); // Use your existing generateToken method
        setToken(generatedToken);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    if(!token){
      fetchToken();
    }
  }, [token]);

  const handleSignupComplete = () => {
    setShowSuccess(true);
    setShowWelcome(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBeginMeeting = () => {
    setShowWelcome(false);
    setShowMeeting(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative">
      {!showWelcome && !showMeeting && (
        <MeetingEntryModal onComplete={handleSignupComplete} />
      )}
      {showWelcome && <WelcomeMessage onBegin={handleBeginMeeting} />}

      {/* Meeting Room */}
      {showMeeting && token && meetingId && (
       <MeetingProvider
       config={{
         meetingId: meetingId || '',
         micEnabled: true,
         webcamEnabled: true,
         name: "Test User",
         mode: "SEND_AND_RECV",
         multiStream: true,
         debugMode: false
       }}
       token={token}
       reinitialiseMeetingOnConfigChange={true}
       joinWithoutUserInteraction={true}
     >
       <MeetingConsumer>
         {() => <MeetingRoom />}
       </MeetingConsumer>
     </MeetingProvider>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500/20 border border-green-400/30 text-white px-6 py-3 rounded-lg animate-fade-in">
          Successfully joined the meeting!
        </div>
      )}
    </div>
  );
};
