import { describe, expect, it } from 'vitest';
import { parseDtcReply, parseElmResponse } from './elm';
describe('ELM response parser', () => {
 it('recognizes searching and no data', () => { expect(parseElmResponse('SEARCHING...\rNO DATA')).toMatchObject({status:'no-data'}); });
 it('extracts codes from a Mode 03 reply', () => { expect(parseDtcReply('43 03 01 00 00')).toEqual(['P0301']); });
});
