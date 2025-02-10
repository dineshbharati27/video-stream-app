import { useState } from "react";
import VideoList from "./components/VideoList";
import VideoUpload from "./components/VideoUpload";

function App() {
  const [view, setView] = useState("home"); // 'home' for videos, 'upload' for form

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-[#1A1A1D] text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-xl font-bold">Video App</h1>
          <div className="space-x-4">
            <button
              onClick={() => setView("home")}
              className={`px-4 py-2 rounded-md transition duration-300 ${
                view === "home"
                  ? "bg-[#6A1E55] text-white"
                  : "bg-[#3B1C32] hover:bg-[#A64D79]"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setView("upload")}
              className={`px-4 py-2 rounded-md transition duration-300 ${
                view === "upload"
                  ? "bg-[#6A1E55] text-white"
                  : "bg-[#3B1C32] hover:bg-[#A64D79]"
              }`}
            >
              Upload Video
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mx-auto p-6">
        {view === "home" ? <VideoList /> : <VideoUpload />}
      </div>
    </div>
  );
}

export default App;
