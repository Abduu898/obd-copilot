import { decodeDtcBytes } from './decoder';
export type ElmReply = { lines: string[]; status: 'ok' | 'searching' | 'no-data' | 'error'; hex: number[] };
export function parseElmResponse(raw: string): ElmReply {
 const lines = raw.toUpperCase().replace(/[>\r]/g, '\n').split(/[\n\s]+/).filter(Boolean);
 const status = raw.toUpperCase().includes('NO DATA') ? 'no-data' : lines.some(s => s.includes('SEARCHING')) ? 'searching' : lines.includes('ERROR') || lines.includes('UNABLE') ? 'error' : 'ok';
 const hex: number[] = [];
 for (const token of lines) if (/^[0-9A-F]{2}$/.test(token)) hex.push(parseInt(token, 16));
 return { lines, status, hex };
}
export function parseDtcReply(raw: string, mode: '03'|'07'|'0A' = '03') {
 const parsed = parseElmResponse(raw); const marker = parseInt(mode,16) + 0x40;
 const start = parsed.hex.indexOf(marker); return start < 0 ? [] : decodeDtcBytes(parsed.hex.slice(start + 1));
}
