import fs from "node:fs";
import path from "node:path";

// This homepage is the hand-built concept mockup, ported over as-is so we can
// get a live link to show the client. It'll get broken into real components,
// with images moved out of base64 into /public, in the next pass.

export default function Home() {
  const contentPath = path.join(process.cwd(), "src/app/home-content.html");
  const scriptPath = path.join(process.cwd(), "src/app/home-script.js");

  const bodyHtml = fs.readFileSync(contentPath, "utf-8");
  const scriptJs = fs.readFileSync(scriptPath, "utf-8");

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <script dangerouslySetInnerHTML={{ __html: scriptJs }} />
    </>
  );
}
