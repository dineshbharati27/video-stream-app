import React from "react";

const VideoPlayer = ({ videoUrl }) => {
  return (
    <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
      <video
        controls
        className="w-full h-full object-cover rounded-lg"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
