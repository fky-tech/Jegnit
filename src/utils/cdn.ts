const SUPABASE_ORIGIN = 'https://fbgmwoldofhnlfnqfsug.supabase.co';
const CDN_URL = (
    process.env.NEXT_PUBLIC_STORAGE_CDN_URL ||
    'https://jegnit-storage-proxy.fikreyohannesbiruk.workers.dev'
).replace(/\/$/, '');

/**
 * Transforms Supabase Storage URLs into Cloudflare Worker CDN URLs.
 * Keeps non-Supabase URLs and null/undefined values untouched.
 * Does NOT modify any Supabase database rows.
 */
export function getCdnUrl(url?: string | null): string {
    if (!url) return '';
    if (typeof url !== 'string') return '';
    if (url.startsWith(SUPABASE_ORIGIN)) {
        return url.replace(SUPABASE_ORIGIN, CDN_URL);
    }
    return url;
}
