import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

// Manual parser to bypass dotenv/Next.js loading issues and handle encoding
const loadEnvManually = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const buffer = fs.readFileSync(envPath);
            let content = '';

            // Detect UTF-16LE or null bytes common in Windows files
            if (buffer.indexOf(0x00) !== -1) {
                console.log('[ManualEnv] Detected UTF-16LE encoding (null bytes found)');
                content = buffer.toString('utf16le');
            } else {
                content = buffer.toString('utf8');
            }

            // Remove BOM if present
            content = content.replace(/^\uFEFF/, '');

            const lines = content.split(/\r?\n/);
            console.log(`[ManualEnv] Parsing ${lines.length} lines from .env.local`);

            lines.forEach(line => {
                const trimmed = line.trim();
                // Skip comments and empty lines
                if (!trimmed || trimmed.startsWith('#')) return;

                const eqIdx = trimmed.indexOf('=');
                if (eqIdx > 0) {
                    const key = trimmed.substring(0, eqIdx).trim();
                    let val = trimmed.substring(eqIdx + 1).trim();

                    // Remove quotes if present
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }

                    if (!process.env[key]) {
                        process.env[key] = val;
                    }
                }
            });
        }
    } catch (e) {
        console.error("[ManualEnv] Failed to parse .env.local", e);
    }
};

// Execute load immediately
loadEnvManually();

export const getSupabaseAdmin = () => {
    // Access env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl) {
        console.error("Critical: NEXT_PUBLIC_SUPABASE_URL is missing.");
        throw new Error("Supabase URL is missing.");
    }

    if (!supabaseServiceKey) {
        console.error("Critical: Service Role Key is missing");
        throw new Error("Supabase Service Role Key is missing.");
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
