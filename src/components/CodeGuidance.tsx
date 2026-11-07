import { Info } from 'lucide-react';
import React from 'react';
import type { CodeData } from '@/lib/types';

export function CodeGuidance({ entry }: { entry: CodeData }) {
 return <>
  {entry.quickCheck&&<section className="quick-check report-section"><div className="section-label"><span className="section-number">04</span><span>QUICK CHECK YOU CAN DO</span></div><h3>{entry.quickCheck.title}</h3><ol>{entry.quickCheck.steps.map((step,i)=><li key={step}><span>{i+1}</span>{step}</li>)}</ol>{entry.quickCheck.caution&&<p className="quick-check-caution"><Info size={14}/>{entry.quickCheck.caution}</p>}</section>}
  <div className="bottom-grid"><section className="report-section"><div className="section-label"><span className="section-number">{entry.quickCheck?'05':'04'}</span><span>WHAT TO TELL THE MECHANIC</span></div><p className="section-intro">Ask them to start with these three checks:</p><ol className="checklist">{entry.mechanicChecklist.slice(0,3).map((item,i)=><li key={item}><span>{i+1}</span>{item}</li>)}</ol>{entry.driverQuestions&&<><h3 className="questions-title">Tell your mechanic</h3><ul className="driver-questions">{entry.driverQuestions.map(question=><li key={question}>{question}</li>)}</ul></>}</section><section className="avoid-panel"><div className="section-label"><span className="section-number">{entry.quickCheck?'06':'05'}</span><span>WHAT NOT TO PAY FOR YET</span></div><ul>{entry.dontReplaceYet.map(item=><li key={item}><span>×</span>{item}</li>)}</ul></section></div>
 </>;
}
