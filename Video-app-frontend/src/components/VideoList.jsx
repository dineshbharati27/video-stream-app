import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("https://video-app-backend-1.onrender.com/videos")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setVideos(data);
        }
      })
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center text-[#A64D79] mb-6">
        Uploaded Videos
      </h2>

      {videos.length === 0 ? (
        <p className="text-center text-gray-400">No videos found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="shadow-lg rounded-lg p-4 border border-gray-600"
            >
              <h3 className="text-lg font-semibold mb-2 text-black text-center">
                {video.filename}
              </h3>
              <VideoPlayer videoUrl={video.videoUrl} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
