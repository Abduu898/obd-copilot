export type DtcFamily = 'Powertrain' | 'Body' | 'Chassis' | 'Network';
export type DecodedDtc = { code: string; family: DtcFamily; prefix: string; generic: boolean; system: string };
const families: Record<string, DtcFamily> = { P: 'Powertrain', B: 'Body', C: 'Chassis', U: 'Network' };
const systems: Record<string, string> = { '0':'Fuel and air metering', '1':'Fuel and air metering', '2':'Fuel and air metering', '3':'Ignition and misfire', '4':'Auxiliary emissions controls', '5':'Vehicle speed and idle controls', '6':'Computer and output circuits', '7':'Transmission controls', '8':'Transmission controls', '9':'Transmission controls', A:'Hybrid propulsion', B:'Hybrid propulsion', C:'Hybrid propulsion' };
export function decodeDtc(code: string): DecodedDtc | null {
 const normalized = code.trim().toUpperCase();
 const match = /^([PBCU])([0-3])([0-9A-F]{3})$/.exec(normalized);
 if (!match) return null;
 return { code: normalized, family: families[match[1]], prefix: match[1], generic: match[2] === '0' || match[2] === '2', system: match[1] === 'P' ? (systems[normalized[2]] || 'Powertrain') : families[match[1]] };
}
export function decodeDtcBytes(bytes: number[]): string[] {
 const result: string[] = [];
 for (let i = 0; i + 1 < bytes.length; i += 2) {
  const [a, b] = [bytes[i] & 255, bytes[i + 1] & 255]; if (a === 0 && b === 0) continue;
  const prefix = ['P','C','B','U'][(a >> 6) & 3]; const digit = (a >> 4) & 3;
  result.push(`${prefix}${digit}${(a & 15).toString(16).toUpperCase()}${(b >> 4).toString(16).toUpperCase()}${(b & 15).toString(16).toUpperCase()}`);
 }
 return [...new Set(result)];
}
