import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/uploadFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: event.target[0].value }),
      });
      const { data } = await response.json();
      setLink(data.signedUrl);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <Head>
        <title>Link Provider</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleFormSubmit}>
        <input type="text" />
        <button type="submit">Upload</button>
        <div>
          Link: <a href={link}>{link}</a>
        </div>
      </form>
    </>
  );
}
