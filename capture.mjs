// Usage: node capture.mjs serve   |   node capture.mjs stills 0.5 2.4 ...   |   node capture.mjs video [fps]
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname } from 'node:path';

const types = {
	'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
	'.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml',
};
const server = createServer(async (req, res) => {
	const p = decodeURIComponent(req.url.split('?')[0]);
	try {
		const body = await readFile('.' + (p === '/' ? '/index.html' : p));
		res.writeHead(200, { 'content-type': types[extname(p)] ?? 'text/html' });
		res.end(body);
	} catch { res.writeHead(404); res.end(); }
}).listen(process.argv[2] === 'serve' ? 8000 : 0);
const port = server.address().port;

const [mode = 'stills', ...args] = process.argv.slice(2);
if (mode === 'serve') {
	console.log(`Preview: http://localhost:${port}/  (add ?t=12.3 to hold a frame)`);
	await new Promise(() => {});
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('console', (m) => console.log('[page]', m.text()));
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(`http://localhost:${port}/`);
await page.evaluate(() => window.ready);
const cdp = await page.context().newCDPSession(page);
const shot = async (format) => Buffer.from((await cdp.send('Page.captureScreenshot', { format, quality: format === 'jpeg' ? 95 : undefined })).data, 'base64');
const frame = (t) => page.evaluate((t) => { window.renderAt(t); return new Promise((r) => requestAnimationFrame(() => r())); }, t);

if (mode === 'stills') {
	await mkdir('stills', { recursive: true });
	for (const t of args.map(Number)) {
		await frame(t);
		await writeFile(`stills/t${t.toFixed(2).padStart(5, '0')}.png`, await shot('png'));
		console.log('still', t);
	}
} else {
	const fps = Number(args[0] ?? 60), secs = await page.evaluate(() => window.DUR), n = Math.round(fps * secs);
	await mkdir('video', { recursive: true });
	const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
		'-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'video/watch-tail-hype-manga.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
	const t0 = Date.now();
	for (let f = 0; f < n; f++) {
		await frame(f / fps);
		const buf = await shot('jpeg');
		if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
		if (f % fps === 0) console.log(`frame ${f}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
	}
	ff.stdin.end();
	await new Promise((r) => ff.on('close', r));
	console.log('done');
}
await browser.close();
server.close();
