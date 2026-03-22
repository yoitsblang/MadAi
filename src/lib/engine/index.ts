// Utility functions
export { profileToContext, formatMessages } from './utils';

// Intake engine
export { runIntake, extractProfileFromConversation } from './intake';

// Diagnosis engine
export { runValueDiagnosis, runBusinessLogic } from './diagnosis';

// Platform analysis engine
export { runPlatformAnalysis } from './platform';

// Psychology engine
export { runPsychologyAnalysis } from './psychology';

// Ethics engine
export { evaluateEthics, evaluateStrategy } from './ethics';

// Strategy engines (macro, meso, micro)
export { generateMacroStrategy, generateMesoStrategy, generateMicroStrategy } from './strategy';

// Research engine (with search grounding)
export { conductMarketResearch, researchCompetitors, researchTrends } from './research';

// Timing engine (with search grounding)
export { analyzeTimingContext } from './timing';

// Innovation engine
export { generateInnovation } from './innovation';
