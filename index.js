const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

const app = express();

// Set the storage configuration for Multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads")); // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs"); // Set EJS as the view engine

app.get("/", (req, res) => {
  // Read the list of uploaded PDF files in the "uploads" directory
  fs.readdir("uploads", (err, files) => {
    if (err) {
      console.error('Error reading "uploads" directory:', err);
      res.status(500).send('Error reading the "uploads" directory');
      return;
    }
    res.render("index", { files });
  });
});

app.post("/upload", upload.single("pdfFile"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }
  const fileName = req.file.filename;
  const filePath = req.file.path;
  res.redirect("/");
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
