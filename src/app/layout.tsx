import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'OBD Copilot — Understand your check-engine light', description: 'A clear, cautious report for your car fault codes. Free, private, and built for your browser.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
