# OBD Copilot

A free, browser based OBD-II code report. No account or database is used. Reports are recreated from URL parameters and the local code library.

## Run locally

1. Install Node.js 20 or later.
2. Install packages with `pnpm install` (or `npm install`).
3. Start the app with `pnpm dev` (or `npm run dev`) and open the local URL shown in the terminal.
4. Create a production build with `pnpm build`.
5. Deploy the repository to Vercel. The default Next.js build settings work without a database or environment variables.

## Use the report

Enter one or more OBD-II codes, separated by commas. Make, model, year, engine, and mileage are optional. The report includes a plain-language summary, ranked likely causes, cautious drive guidance, mechanic checks, and parts to hold off replacing. Use **Download PDF** to print or save a one-page report, or copy the report URL to share it.

The report is informational and does not diagnose a vehicle. Every seeded code entry currently has `reviewed: false`; fact-check the text before treating it as a repair procedure.

## Add or update codes

Edit `data/codes.json`. Each entry follows this shape:

```json
{
  "code": "P0301",
  "title": "Cylinder 1 misfire detected",
  "meaning": "Plain language description.",
  "system": "Ignition and misfire",
  "severity": "red",
  "safeToDriveNote": "Cautious, symptom-aware guidance.",
  "causes": [{ "name": "Possible cause", "likelihood": 3, "notes": "Why to check it." }],
  "mechanicChecklist": ["First check", "Second check", "Third check"],
  "dontReplaceYet": ["Part to avoid replacing before checks"],
  "carSpecific": [{ "make": "Example", "model": "Example model", "yearFrom": 2015, "yearTo": 2020, "extraCauses": [] }],
  "reviewed": false
}
```

Likelihood uses 1 (lower) to 5 (higher). Car-specific causes are merged with generic causes when their vehicle information matches. Keep `reviewed: false` until a person has checked the entry against reliable service information. Do not add price estimates or guess causes for unrecognized codes.

## Scanner support

The **Demo mode** uses recorded ELM327-style replies and requires no vehicle. Web Serial (USB) and Web Bluetooth LE are feature-detected when available; support depends on browser, operating system, and adapter firmware. Common Bluetooth services FFF0 and FFE0 are included, with an optional field for extra service UUIDs. iOS Safari does not support these browser APIs here, so manual entry remains available.

**Tested adapters:** the built-in mock adapter only. No physical adapter models have been tested for this project yet. Generic ELM327 adapters vary widely in service UUIDs, characteristics, baud rate, and command behavior; verify compatibility safely before relying on live data. Clearing codes resets emissions readiness monitors and requires an explicit confirmation.

## Checks

Run unit tests with `pnpm test` (or `npm test`). They cover DTC byte decoding and ELM response parsing.
