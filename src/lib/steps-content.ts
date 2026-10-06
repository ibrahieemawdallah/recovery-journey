/**
 * The complete 12-step programme content, in order.
 *
 * Each step carries four teaching layers rather than a slogan:
 *   whatItMeans      — the concept in plain language
 *   howToWork        — the concrete actions that constitute working the step
 *   example          — a worked example so the abstract becomes visible
 *   completionSigns  — how you know the step is genuinely finished
 *
 * Consumed by src/app/steps/page.tsx and the dashboard's step summary.
 */

import { STEPS_1_TO_6, type StepContent } from './steps-content-1-6'
import { STEPS_7_TO_12 } from './steps-content-7-12'

export type { StepContent }

export const TWELVE_STEPS_CONTENT: StepContent[] = [
  ...STEPS_1_TO_6,
  ...STEPS_7_TO_12,
]

/** Lookup by step number (1–12). */
export function getStep(n: number): StepContent | undefined {
  return TWELVE_STEPS_CONTENT.find((s) => s.number === n)
}
