import React, { useState } from "react";
import axios from "axios";

const VideoUpload = () => {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);


  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!title || !video) {
      alert("Please enter a title and select a video!");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", video);
  
    try {
      setLoading(true);
      const res = await axios.post("https://video-stream-app-32j9.vercel.app/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video uploaded successfully!");
      console.log(res.data);
      setTitle(""); // Clear input fields
      setVideo(null);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 border border-[#6A1E55]">
      <h2 className="text-xl font-bold mb-4 text-[#A64D79] text-center">
        Upload Video
      </h2>
      <input
        type="text"
        placeholder="Enter Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-[#6A1E55] p-2 mb-4 w-full bg-white text-black placeholder-gray-400 rounded"
      />
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4 text-black"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`bg-[#A64D79] text-black px-4 py-2 rounded w-full 
                    hover:bg-[#6A1E55] transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

    </div>
  );
};

export default VideoUpload;
