import express, { type Request, type Response } from "express";
import fileUpload, { type UploadedFile } from "express-fileupload";
import { PDFParse } from "pdf-parse";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

// allow cross-origin requests from specified origins
app.use(
  cors({
    origin: ["http://localhost:3000", "https://repurpose-ai.vercel.app"],
  })
);

// middleware to handle file uploads
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
    abortOnLimit: true,
  })
);

// health check endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "PDF Parser API is running" });
});

// function to parse PDF buffer
async function parsePDF(file: Uint8Array) {
  const parser = new PDFParse(file);
  const data = await parser.getText();
  const info = await parser.getInfo({ parsePageInfo: true });
  return { text: data?.text || "", info, numpages: info?.pages || 0 };
}

// PDF upload and parsing endpoint
app.post("/upload", async (req: Request, res: Response) => {
  try {
    if (!req.files || !("file" in req.files)) {
      return res.status(400).json({
        error: "No PDF file shared.",
        body: `Body is ${JSON.stringify(req.body)}`,
      });
    }

    const pdfFile = req.files.file as UploadedFile;
    const unit8ArrayData = new Uint8Array(pdfFile?.data);
    const result = await parsePDF(unit8ArrayData);
    console.log("PDF parsed successfully: ", result);
    res.json({ result, success: true });
  } catch (error) {
    console.error("Error processing PDF:", error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message, success: false });
    } else if (
      error instanceof Error &&
      error.message.includes("PDF file is empty")
    ) {
      return res.status(500).json({ error: error.message, success: false });
    }
    res.status(500).json({
      error: "Failed to process PDF due to an unknown error.",
      success: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
