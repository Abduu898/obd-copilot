export type Severity = 'green'|'yellow'|'red';
export type Cause = { name: string; likelihood: number; notes: string; cost?: '$'|'$$'|'$$$' };
export type QuickCheck = { title: string; steps: string[]; caution?: string };
export type CodeData = { code: string; title: string; meaning: string; system: string; severity: Severity; safeToDriveNote: string; causes: Cause[]; mechanicChecklist: string[]; dontReplaceYet: string[]; quickCheck?: QuickCheck; driverQuestions?: string[]; carSpecific: { make: string; model?: string; yearFrom?: number; yearTo?: number; extraCauses: Cause[] }[]; reviewed: false };

export const severityLabels: Record<Severity, string> = {
 green: 'Okay to drive gently',
 yellow: 'Get it checked soon',
 red: 'Stop and check',
};
