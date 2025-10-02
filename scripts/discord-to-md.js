// scripts/discord-to-images-attachments-only.js
// Upload only Discord-export attachments (images + gifs) to Supabase.
// Keeps original filename & extension, preserves GIFs, skips inline/YouTube links.
//
// Usage: node scripts/discord-to-images-attachments-only.js
// Requires .env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.next_public_supabase_url;
const SUPABASE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.supabase_service_role_key;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

// Only attachments that are image/gif-like (extension-based)
const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

function looksLikeImageFilename(fname) {
    const ext = path.extname(fname || '').toLowerCase();
    return IMAGE_EXTS.includes(ext);
}

function basenameFromUrl(url) {
    try {
        const u = new URL(url);
        return decodeURIComponent(path.basename(u.pathname).split('?')[0]).replace(/[:#]/g, '_') || 'file';
    } catch {
        return 'file';
    }
}

async function fetchBuffer(url) {
    // Node 18+ has global fetch
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'discord-export-uploader/1.0',
            Accept: '*/*'
        }
    });
    if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || undefined;
    return { buffer, contentType };
}

async function uploadBufferToSupabase(buffer, filename, bucket, folder, contentType) {
    const safeFolder = (folder || '').replace(/^\/+|\/+$/g, '');
    const storageBase = safeFolder ? `${safeFolder}` : '';
    const storagePath = storageBase ? `${storageBase}/${Date.now()}-${filename}` : `${Date.now()}-${filename}`;

    // Try a few times in case of conflicts/errors
    for (let attempt = 0; attempt < 3; attempt++) {
        const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: contentType || undefined
        });

        if (!error) {
            const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
            return data.publicUrl;
        }

        // If a conflict or other problem, retry with suffix
        const suffix = Math.floor(Math.random() * 1e6);
        const fname = `${Date.now()}-${suffix}-${filename}`;
        if (storageBase) {
            storagePath = `${storageBase}/${fname}`;
        } else {
            storagePath = `${fname}`;
        }
    }

    throw new Error(`Failed to upload ${filename} after retries`);
}

async function main() {
    console.log('📥 Discord-export attachments → Supabase (attachments-only, preserves GIFs)');

    const exportPath = await ask('Path to Discord export JSON (e.g. export.json): ');
    if (!fs.existsSync(exportPath)) {
        console.error('❌ File not found.');
        process.exit(1);
    }

    // Load JSON
    let json;
    try {
        json = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    } catch (err) {
        console.error('❌ Failed to parse JSON:', err.message);
        process.exit(1);
    }

    const messages = Array.isArray(json.messages) ? json.messages : [];
    if (messages.length === 0) {
        console.error('❌ No messages in export JSON.');
        process.exit(1);
    }

    // Optional: pick one author (keeps your earlier flow)
    const authorsMap = new Map();
    for (const m of messages) {
        if (m.author?.id) authorsMap.set(m.author.id, m.author.name || m.author.username || '(unknown)');
    }
    const authors = Array.from(authorsMap.entries());
    let chosenAuthorId = null;
    if (authors.length > 1) {
        console.log('\n👤 Authors found:');
        authors.forEach(([id, name], i) => console.log(`  [${i + 1}] ${name} (${id})`));
        console.log('  [0] All authors');
        const choice = await ask('Select an author (number) to limit uploads or 0 for all: ');
        const idx = parseInt(choice, 10);
        if (!isNaN(idx) && idx > 0 && idx <= authors.length) {
            chosenAuthorId = authors[idx - 1][0];
            console.log(`✔ Filtering attachments by ${authors[idx - 1][1]} (${chosenAuthorId})`);
        } else {
            console.log('✔ Uploading attachments from all authors');
        }
    } else if (authors.length === 1) {
        chosenAuthorId = authors[0][0];
        console.log(`✔ Only one author detected: ${authors[0][1]} (${chosenAuthorId})`);
    }

    const bucket = await ask('Supabase bucket name: ');
    if (!bucket) {
        console.error('❌ Bucket required.');
        process.exit(1);
    }
    const folder = await ask('Folder within bucket (e.g. posts/orca) [optional]: ');

    // collect attachments (only from .attachments), dedupe by URL
    const urlMap = new Map(); // originalUrl -> { filename, content_type }
    for (const msg of messages) {
        if (chosenAuthorId && msg.author?.id !== chosenAuthorId) continue;

        if (Array.isArray(msg.attachments)) {
            for (const att of msg.attachments) {
                if (!att?.url) continue;
                const fnameGuess = att.filename || basenameFromUrl(att.url) || path.basename(att.url);
                // accept only image/gif extensions
                if (!looksLikeImageFilename(fnameGuess)) continue;
                if (!urlMap.has(att.url)) {
                    urlMap.set(att.url, { filename: fnameGuess, content_type: att.content_type || undefined });
                }
            }
        }
    }

    const allUrls = Array.from(urlMap.entries());
    console.log(`\nFound ${allUrls.length} attachment(s) (images/gifs) to upload.`);

    if (allUrls.length === 0) {
        console.log('Nothing to upload. Exiting.');
        rl.close();
        return;
    }

    const outLines = [];
    // optional tmp dir for downloaded files
    const tmpDir = path.join(__dirname, 'tmp_attachments');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    let idx = 0;
    for (const [url, meta] of allUrls) {
        idx++;
        process.stdout.write(`\n[${idx}/${allUrls.length}] ${url} → `);
        try {
            const { buffer, contentType: fetchedContentType } = await fetchBuffer(url);
            // prefer att.content_type from export metadata if present; otherwise use fetched content-type
            const finalContentType = meta.content_type || fetchedContentType || undefined;
            const filename = meta.filename || basenameFromUrl(url);
            // upload preserving filename and extension
            const uploadedUrl = await uploadBufferToSupabase(buffer, filename, bucket, folder, finalContentType);
            console.log('uploaded →', uploadedUrl);
            outLines.push(`${url} -> ${uploadedUrl}`);
            // optionally write a local copy for debugging
            try {
                fs.writeFileSync(path.join(tmpDir, `${Date.now()}-${filename}`), buffer);
            } catch (e) {
                // ignore local write errors
            }
        } catch (err) {
            console.warn('failed →', err.message);
            outLines.push(`${url} -> FAILED: ${err.message}`);
        }
    }

    // write mapping file
    const outPath = path.join(__dirname, 'attachment-urls.txt');
    fs.writeFileSync(outPath, outLines.join('\n'), 'utf8');

    rl.close();
    console.log(`\n\n✅ Done. Mapping saved to ${outPath}`);
    console.log('Tip: check tmp_attachments/ for downloaded files (for debugging).');
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
