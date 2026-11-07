import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { CodeGuidance } from './CodeGuidance';
import type { CodeData } from '@/lib/types';

describe('CodeGuidance', () => {
 it('renders legacy entries without optional fields', () => {
  const entry: CodeData = {
   code: 'P0300',
   title: 'Random misfire',
   meaning: 'A misfire was detected.',
   system: 'Ignition and misfire',
   severity: 'red',
   safeToDriveNote: 'Get it checked.',
   causes: [],
   mechanicChecklist: ['Check the misfire counts'],
   dontReplaceYet: ['The catalytic converter'],
   carSpecific: [],
   reviewed: false,
  };
  const markup=renderToStaticMarkup(<CodeGuidance entry={entry}/>);
  expect(markup).toContain('WHAT TO TELL THE MECHANIC');
  expect(markup).toContain('Check the misfire counts');
  expect(markup).not.toContain('QUICK CHECK YOU CAN DO');
  expect(markup).not.toContain('Tell your mechanic');
 });
});
