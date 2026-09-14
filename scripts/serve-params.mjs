// Static server for params/ with `Access-Control-Allow-Origin: *`. The snap fetches from the MetaMask
// origin, so a server without CORS headers does not work. Usage: node scripts/serve-params.mjs [port] [dir]
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { join, normalize } from "node:path";

const port = Number(process.argv[2] ?? 8099);
const root = normalize(process.argv[3] ?? new URL("../params", import.meta.url).pathname);

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  if (req.method === "OPTIONS") return res.writeHead(204).end();
  // normalize() removes "..". The prefix check keeps the path in root.
  const path = join(root, normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!path.startsWith(root)) return res.writeHead(403).end();
  let size;
  try { size = statSync(path).size; } catch { return res.writeHead(404).end("not found"); }
  res.writeHead(200, { "content-type": "application/octet-stream", "content-length": size });
  createReadStream(path).pipe(res);
});
// The prover blocks the client thread for up to a minute. With the 5 s default, the server closes the
// idle connection and the client gets "fetch failed".
server.keepAliveTimeout = 300_000;
server.headersTimeout = 310_000;
server.listen(port, () => console.log(`serving ${root} on http://127.0.0.1:${port} (CORS *)`));
