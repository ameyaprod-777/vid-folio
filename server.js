const http = require("http");
const fs = require("fs");
const path = require("path");
const seo = require("./seo");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 4173;

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const name = trimmed.slice(0, trimmed.indexOf("=")).trim();
    let value = trimmed.slice(trimmed.indexOf("=") + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[name]) process.env[name] = value;
  }
}

loadEnv(path.join(ROOT, ".env.local"));
loadEnv(path.join(ROOT, ".env"));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

// Toutes les pages du site partagent index.html ; seul le <head> change
// selon la langue (/ ou /fr/) et le projet (/work/<nom-du-projet>).
function sendPage(request, response, lang, found, status) {
  fs.readFile(path.join(ROOT, "index.html"), "utf8", (error, html) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    const body = seo.renderPage(html, lang, found);
    const headers = headersFor("index.html");
    headers["Content-Language"] = lang;
    response.writeHead(status || 200, headers);
    response.end(request.method === "HEAD" ? undefined : body);
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100000) {
        reject(new Error("too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function handleContact(request, response) {
  let data;
  try {
    data = JSON.parse(await readBody(request));
  } catch {
    sendJson(response, 400, { error: "Invalid request data" });
    return;
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const message = String(data.message || "").trim();
  const budget = String(data.budget || "").trim();
  const honeypot = String(data.honeypot || "").trim();

  if (honeypot) {
    sendJson(response, 200, { success: true, message: "Message sent successfully" });
    return;
  }

  if (!name || !email || !message) {
    sendJson(response, 400, { error: "Name, email, and message are required" });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendJson(response, 400, { error: "Please enter a valid email address" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    sendJson(response, 500, { error: "Email service is not configured. Please contact the administrator." });
    return;
  }

  const to = process.env.CONTACT_EMAIL || "contact@ameya.tv";
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  const safeBudget = escapeHtml(budget || "Not specified");

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "AMEYA <contact@ameya.tv>",
      to: [to],
      reply_to: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Budget:</strong> ${safeBudget}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
      text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nBudget: ${budget || "Not specified"}\n\nMessage:\n${message}`
    })
  });

  if (!sent.ok) {
    sendJson(response, 500, { error: "Failed to send message. Please try again later." });
    return;
  }

  sendJson(response, 200, { success: true, message: "Message sent successfully" });
}

function headersFor(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff"
  };
}

function pipeFile(request, response, file) {
  const stream = fs.createReadStream(file);
  stream.on("error", () => {
    if (response.headersSent) {
      response.destroy();
      return;
    }
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  });
  response.writeHead(200, headersFor(file));
  if (request.method === "HEAD") {
    stream.destroy();
    response.end();
    return;
  }
  stream.pipe(response);
}

function serveFile(request, response) {
  let url;
  try {
    url = new URL(request.url, "http://127.0.0.1");
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  if (pathname.includes("\0") || pathname.split("/").includes("..") || pathname.startsWith("/.")) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  // ameya.tv/fr → ameya.tv/fr/ ; les fichiers sous /fr/ sont ceux de la racine.
  if (pathname === "/fr") {
    response.writeHead(301, { Location: "/fr/" + url.search });
    response.end();
    return;
  }
  if (pathname === "/sitemap.xml") {
    response.writeHead(200, {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    });
    response.end(request.method === "HEAD" ? undefined : seo.sitemap());
    return;
  }

  const lang = pathname.startsWith("/fr/") ? "fr" : "en";
  const prefix = lang === "fr" ? "/fr" : "";
  if (lang === "fr") pathname = pathname.slice(3);

  if (pathname === "/" || pathname === "/index.html") {
    sendPage(request, response, lang, null);
    return;
  }

  // Une page par projet : /work/da-uzi-vrai-n et /fr/work/da-uzi-vrai-n.
  const work = pathname.match(/^\/work\/([^/]+?)(\/?)$/);
  if (work) {
    const found = seo.findWork(work[1]);
    if (found && (work[2] || found.slug !== work[1])) {
      response.writeHead(301, { Location: prefix + "/work/" + found.slug + url.search });
      response.end();
      return;
    }
    sendPage(request, response, lang, found, found ? 200 : 404);
    return;
  }
  const file = path.normalize(path.join(ROOT, pathname));
  if (!file.startsWith(ROOT)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  fs.stat(file, (error, stat) => {
    if (!error && stat.isFile()) {
      pipeFile(request, response, file);
      return;
    }

    const ext = path.extname(pathname).toLowerCase();
    const index = path.join(ROOT, "index.html");
    if ((!ext || ext === ".html") && !pathname.startsWith("/api/") && fs.existsSync(index)) {
      sendPage(request, response, lang, null);
      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  });
}

const server = http.createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;
    if (request.method === "POST" && pathname === "/api/contact") {
      await handleContact(request, response);
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Method not allowed");
      return;
    }

    serveFile(request, response);
  } catch {
    if (response.headersSent) {
      response.end();
      return;
    }
    sendJson(response, 500, { error: "An error occurred. Please try again later." });
  }
});

server.on("clientError", (error, socket) => {
  if (socket.writable) socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(PORT, () => {
  console.log(`AMEYA site ready at http://127.0.0.1:${PORT}`);
  seo.refreshVideoInfo();
  setInterval(seo.refreshVideoInfo, 6 * 3600 * 1000).unref();
});
