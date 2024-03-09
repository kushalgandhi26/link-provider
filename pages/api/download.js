import { pipeline } from "stream";
import { promisify } from "util";
import fetch from "node-fetch";

const pipelineAsync = promisify(pipeline);

export default async function handler(req, res) {
  try {
    const response = await fetch(req.body.url);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const contentDisposition = response.headers.get("content-disposition");
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1]
      : "download.pdf";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await pipelineAsync(response.body, res);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
