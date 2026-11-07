'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CarFront, ChevronDown, CircleHelp, Gauge, Moon, ShieldCheck, Sun, Wrench } from 'lucide-react';
import { encodeVehicle } from '@/lib/vehicle';
import { Scanner } from '@/components/Scanner';

export default function Home() {
 const router=useRouter(); const [codes,setCodes]=useState(''); const [make,setMake]=useState(''); const [model,setModel]=useState(''); const [year,setYear]=useState(''); const [engine,setEngine]=useState(''); const [mileage,setMileage]=useState(''); const [expanded,setExpanded]=useState(false); const [error,setError]=useState(''); const [dark,setDark]=useState(false);
 const openReport=(incoming=codes)=>{ const normalized=incoming.split(/[ ,\n]+/).map(s=>s.trim().toUpperCase()).filter(Boolean); if(!normalized.length){setError('Enter at least one fault code to get started.');return;} if(normalized.some(s=>!/^([PBCU][0-3][0-9A-F]{3})$/.test(s))){setError('Please check the format. Codes look like P0301 or U0100.');return;} router.push(`/report?${encodeVehicle({codes:normalized,make,model,year,engine,mileage})}`); };
 return <main className={dark?'app-shell dark':'app-shell'}>
  <header className="topbar"><a className="brand" href="/"><span className="brand-mark"><Gauge size={20}/></span><span>OBD <b>Copilot</b></span></a><div className="header-right"><span className="free-pill"><span/> Free forever</span><button aria-label="Toggle color theme" className="icon-button" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button></div></header>
  <section className="hero"><div className="hero-copy"><div className="eyebrow"><ShieldCheck size={14}/> YOUR CAR, IN PLAIN ENGLISH</div><h1>That warning light?<br/><span>Let’s make sense of it.</span></h1><p className="hero-lede">A clear, calm report for your check-engine codes. Know what might be going on and what to ask your mechanic.</p></div>
   <div className="form-card"><div className="card-top"><div><h2>Start with your fault code</h2><p>No scanner? Find codes in your OBD-II app or scan tool.</p></div><span className="step-badge">01 <i>/ 01</i></span></div>
    <label className="field-label" htmlFor="codes">FAULT CODE(S)</label><textarea id="codes" value={codes} onChange={e=>{setCodes(e.target.value);setError('');}} placeholder="e.g. P0301, P0420" rows={2}/><div className="field-hint"><CircleHelp size={13}/> Add multiple codes separated by commas</div>
    <button className="details-toggle" onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}><span><CarFront size={17}/> Add vehicle details <small>for a more relevant report</small></span><ChevronDown size={17} className={expanded?'rotate':''}/></button>
    {expanded&&<div className="vehicle-grid"><div><label className="field-label" htmlFor="make">MAKE</label><input id="make" value={make} onChange={e=>setMake(e.target.value)} placeholder="e.g. Toyota"/></div><div><label className="field-label" htmlFor="model">MODEL</label><input id="model" value={model} onChange={e=>setModel(e.target.value)} placeholder="e.g. Corolla"/></div><div><label className="field-label" htmlFor="year">YEAR</label><input id="year" type="number" min="1950" max="2035" value={year} onChange={e=>setYear(e.target.value)} placeholder="e.g. 2018"/></div><div><label className="field-label" htmlFor="engine">ENGINE <i>OPTIONAL</i></label><input id="engine" value={engine} onChange={e=>setEngine(e.target.value)} placeholder="e.g. 1.8L"/></div><div className="wide"><label className="field-label" htmlFor="mileage">MILEAGE <i>OPTIONAL</i></label><input id="mileage" value={mileage} onChange={e=>setMileage(e.target.value)} placeholder="e.g. 82,000 km"/></div></div>}
    {error&&<p className="error-text" role="alert">{error}</p>}<button className="primary-button" onClick={()=>openReport()}><span>Get my report</span><ArrowRight size={19}/></button>
    <div className="card-trust"><span><ShieldCheck size={14}/> No account needed</span><span>•</span><span>Nothing stored</span></div>
   </div>
  </section>
  <Scanner onCodes={next=>{setCodes(next.join(', '));openReport(next.join(','));}}/>
  <section className="value-row"><div><span className="value-icon blue"><Wrench size={18}/></span><div><b>Know what to check first</b><p>Likely causes, sorted by probability.</p></div></div><div><span className="value-icon green"><ShieldCheck size={18}/></span><div><b>Drive with more confidence</b><p>A careful guide, never a guarantee.</p></div></div><div><span className="value-icon gold"><CarFront size={18}/></span><div><b>Go in prepared</b><p>Questions to take to the mechanic.</p></div></div></section>
  <footer className="site-footer"><span>OBD Copilot <span className="footer-dot">·</span> A little clarity for the road ahead.</span><span>Private by design <i>—</i> reports are generated in your browser.</span></footer>
 </main>;
}
