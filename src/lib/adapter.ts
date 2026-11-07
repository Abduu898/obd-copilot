export type AdapterEvent = (data: string) => void;
export interface Adapter { connect(): Promise<void>; send(command: string): Promise<string>; onData(listener: AdapterEvent): () => void; disconnect(): Promise<void> }
type Pending = { resolve:(value:string)=>void; reject:(error:Error)=>void; timer:ReturnType<typeof setTimeout>; value:string };
type SerialPortLike = { readable?:ReadableStream<Uint8Array>; writable?:WritableStream<Uint8Array>; open(options:{baudRate:number}):Promise<void>; close():Promise<void> };
type BrowserNavigator = Navigator & { serial?:{requestPort():Promise<SerialPortLike>}; bluetooth?:{requestDevice(options:unknown):Promise<any>} };

export class MockAdapter implements Adapter {
 private listeners = new Set<AdapterEvent>();
 private connected = false;
 async connect() { this.connected = true; }
 async send(command: string) {
  if (!this.connected) throw new Error('Connect the scanner first.');
  const replies: Record<string,string> = { ATZ:'ELM327 v1.5\r>', ATE0:'OK\r>', ATL0:'OK\r>', ATSP0:'OK\r>', '03':'43 03 01 00 00\r>', '07':'NO DATA\r>', '0A':'NO DATA\r>', '0101':'41 01 81 07 65 00\r>', '010C':'41 0C 1A F8\r>', '010D':'41 0D 00\r>', '0105':'41 05 5B\r>', '0142':'41 42 38 40\r>', '0106':'41 06 80\r>', '04':'44\r>' };
  const reply = replies[command.toUpperCase()] ?? 'NO DATA\r>';
  for (const listener of this.listeners) listener(reply);
  return reply;
 }
 onData(listener: AdapterEvent) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
 async disconnect() { this.connected = false; }
}

export class SerialAdapter implements Adapter {
 private port: SerialPortLike | null = null; private reader: ReadableStreamDefaultReader<Uint8Array> | null = null; private listeners = new Set<AdapterEvent>(); private pending:Pending|null=null;
 async connect() {
  const browser=navigator as BrowserNavigator;if (!browser.serial) throw new Error('Web Serial is not supported in this browser.');
  this.port = await browser.serial.requestPort(); await this.port.open({ baudRate: 38400 });
  if (!this.port.readable) throw new Error('The serial adapter could not be opened.'); this.reader = this.port.readable.getReader();
  void this.readLoop();
 }
 private async readLoop() { const decoder = new TextDecoder(); while (this.reader) { try { const {value,done}=await this.reader.read(); if(done) break; const text=decoder.decode(value); this.pending&&(this.pending.value+=text); this.listeners.forEach(fn=>fn(text)); if(text.includes('>')&&this.pending){clearTimeout(this.pending.timer);this.pending.resolve(this.pending.value);this.pending=null;} } catch { break; } } }
 async send(command: string) { if(!this.port?.writable) throw new Error('Scanner is disconnected.'); if(this.pending) throw new Error('Scanner is still responding to the previous command.'); const writer=this.port.writable.getWriter(); const result=new Promise<string>((resolve,reject)=>{const timer=setTimeout(()=>{this.pending=null;reject(new Error('Scanner timed out. Try reconnecting.'));},5000);this.pending={resolve,reject,timer,value:''};}); try{await writer.write(new TextEncoder().encode(`${command}\r`));}catch(e){if(this.pending){clearTimeout(this.pending.timer);this.pending=null;}throw e;}finally{writer.releaseLock();} return result; }
 onData(listener: AdapterEvent) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
 async disconnect() { try { await this.reader?.cancel(); this.reader?.releaseLock(); } catch {} this.reader=null; await this.port?.close().catch(()=>{}); this.port=null; }
}

export class BluetoothAdapter implements Adapter {
 private device: any = null; private characteristic: any = null; private listeners=new Set<AdapterEvent>(); private notifyChar:any=null; private pending:Pending|null=null;
 private uuids:string[];
 constructor(extra:string[]=[]){this.uuids=[...new Set(['0000fff0-0000-1000-8000-00805f9b34fb','0000ffe0-0000-1000-8000-00805f9b34fb',...extra])];}
 async connect() {
  const browser=navigator as BrowserNavigator;if(!browser.bluetooth) throw new Error('Web Bluetooth is not supported in this browser.');
  this.device=await browser.bluetooth.requestDevice({ acceptAllDevices:true, optionalServices:this.uuids });
  const server=await this.device.gatt?.connect(); if(!server) throw new Error('Could not connect to the scanner.');
  for(const uuid of this.uuids) { try { const service=await server.getPrimaryService(uuid); const chars=await service.getCharacteristics(); this.characteristic=chars.find(c=>c.properties.write||c.properties.writeWithoutResponse) ?? null; const notify=chars.find(c=>c.properties.notify||c.properties.indicate); if(notify) { this.notifyChar=notify; notify.addEventListener('characteristicvaluechanged', e=>{ const value=(e.target as any).value; if(value){const text=new TextDecoder().decode(value);this.pending&&(this.pending.value+=text);this.listeners.forEach(fn=>fn(text));if(text.includes('>')&&this.pending){clearTimeout(this.pending.timer);this.pending.resolve(this.pending.value);this.pending=null;}} }); await notify.startNotifications(); } if(this.characteristic) break; } catch {} }
  if(!this.characteristic) throw new Error('No writable ELM327 characteristic was found.');
 }
 async send(command:string) { if(!this.characteristic) throw new Error('Scanner is disconnected.'); if(this.pending) throw new Error('Scanner is still responding to the previous command.'); const result=new Promise<string>((resolve,reject)=>{const timer=setTimeout(()=>{this.pending=null;reject(new Error('Scanner timed out. Try reconnecting.'));},5000);this.pending={resolve,reject,timer,value:''};}); try{await this.characteristic.writeValue(new TextEncoder().encode(`${command}\r`));}catch(e){if(this.pending){clearTimeout(this.pending.timer);this.pending=null;}throw e;} return result; }
 onData(listener:AdapterEvent) { this.listeners.add(listener); return ()=>this.listeners.delete(listener); }
 async disconnect() { if(this.pending){clearTimeout(this.pending.timer);this.pending.reject(new Error('Scanner disconnected.'));this.pending=null;} this.device?.gatt?.disconnect(); this.characteristic=null;this.notifyChar=null; this.device=null; }
}
