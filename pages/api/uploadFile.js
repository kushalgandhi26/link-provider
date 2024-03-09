import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const fileId = uuidv4();

      const fileName = "some-file.pdf";
      const response = await axios.get(req.body.url, {
        responseType: "arraybuffer", // Handle PDF as binary data
        maxContentLength: 10240 * 10240, // Limit file size to 10MB
      });

      // Set response headers for file download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="downloaded.pdf"'
      );

      // Send the PDF data as response
      res.send(Buffer.from(response.data, "binary"));

      // const uploadFile = await supabase.storage
      //   .from("avatars")
      //   .upload(`${fileId}.pdf`, response.data);

      // const { data, error } = await supabase.storage
      //   .from("avatars")
      //   .createSignedUrl(uploadFile.data.path, 3600);

      // res.status(200).json({ data, error });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
