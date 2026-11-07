import { describe, expect, it } from 'vitest';
import { decodeDtc, decodeDtcBytes } from './decoder';
describe('DTC decoder', () => {
 it('decodes family, generic status, and system', () => { expect(decodeDtc('p0301')).toMatchObject({code:'P0301', family:'Powertrain', generic:true, system:'Ignition and misfire'}); });
 it('rejects malformed codes', () => { expect(decodeDtc('P123')).toBeNull(); });
 it('decodes two-byte Mode 03 payloads', () => { expect(decodeDtcBytes([0x03,0x01,0x00,0x00])).toEqual(['P0301']); });
});
