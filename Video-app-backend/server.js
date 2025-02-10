require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GridFSBucket } = require("mongodb");
const stream = require("stream");

const app = express();
app.use(cors()); // Allow all origins
app.use(bodyParser.json());

const mongoURI = process.env.DATABASE_URL;
mongoose.connect(mongoURI);

const conn = mongoose.connection;
let gridFSBucket;

conn.once("open", () => {
  console.log("Database connected successfully");
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "videos" });
});

// Multer setup (stores file in memory before writing to GridFS)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload video to GridFS
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !req.file) {
      return res.status(400).json({ error: "Title and video file are required!" });
    }

    const readableStream = new stream.Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      metadata: { title },
      chunkSizeBytes: 1048576, // 1MB chunk size for faster streaming
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      res.json({ message: "Video uploaded successfully!", fileId: uploadStream.id });
    });

    uploadStream.on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload video" });
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all videos
app.get("/videos", async (req, res) => {
  try {
    // Fetch all stored video files from GridFS
    const files = await gridFSBucket.find().toArray();

    // Check if there are no videos
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "No videos found" });
    }

    // Transform the files into a structured response
    const videoList = files.map((file) => ({
      _id: file._id,                   // Unique ID of the video
      filename: file.metadata.title,    // Video title (from metadata)
      length: file.length,              // Video file size in bytes
      contentType: file.contentType,    // MIME type (e.g., video/mp4)
      uploadDate: file.uploadDate,      // Date when the video was uploaded
      videoUrl: `https://video-stream-app-32j9.vercel.app/video/${file._id}`, // URL to stream the video
    }));

    // Return the video list in JSON format
    res.json(videoList);
  } catch (err) {
    // Handle any errors
    res.status(500).json({ error: err.message });
  }
});

// Stream video with range support
app.get("/video/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const file = await gridFSBucket.find({ _id: fileId }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoSize = file[0].length;
    const contentType = file[0].contentType;
    const range = req.headers.range;

    if (!range) {
      res.set({
        "Content-Length": videoSize,
        "Content-Type": contentType,
      });
      return gridFSBucket.openDownloadStream(fileId).pipe(res);
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB chunks
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    res.status(206).set({
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": contentType,
    });

    const downloadStream = gridFSBucket.openDownloadStream(fileId, { start, end });
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: "Error streaming video" });
  }
});


app.get("/", (req, res) => res.send("api working!"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
