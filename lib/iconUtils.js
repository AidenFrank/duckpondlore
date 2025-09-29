// lib/iconUtils.js
export function getFirstGrapheme(str, fallback = '?') {
    if (!str) return fallback;
    return Array.from(str)[0] || fallback;
}

export function isEmoji(char) {
    if (!char) return false;
    const code = char.codePointAt(0);
    // common emoji ranges (covers most)
    return (
        (code >= 0x1f300 && code <= 0x1f5ff) ||
        (code >= 0x1f600 && code <= 0x1f64f) ||
        (code >= 0x1f680 && code <= 0x1f6ff) ||
        (code >= 0x2600 && code <= 0x26ff) ||
        (code >= 0x2700 && code <= 0x27bf) ||
        (code >= 0x1f900 && code <= 0x1f9ff)
    );
}
