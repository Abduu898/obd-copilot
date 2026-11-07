export type Vehicle = { codes: string[]; make: string; model: string; year: string; engine: string; mileage: string };
export function encodeVehicle(vehicle: Vehicle) {
  const params = new URLSearchParams();
  params.set('codes', vehicle.codes.join(','));
  for (const key of ['make', 'model', 'year', 'engine', 'mileage'] as const) if (vehicle[key]) params.set(key, vehicle[key]);
  return params.toString();
}
export function decodeVehicle(search: string): Vehicle {
  const p = new URLSearchParams(search);
  return { codes: (p.get('codes') || '').split(/[ ,]+/).map(c => c.trim().toUpperCase()).filter(Boolean), make: p.get('make') || '', model: p.get('model') || '', year: p.get('year') || '', engine: p.get('engine') || '', mileage: p.get('mileage') || '' };
}
