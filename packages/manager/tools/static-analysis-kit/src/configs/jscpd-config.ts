import { sharedExclusionPatterns } from './shared-exclusion-patterns';

export const codeDuplicationDefaultOptions = {
  mode: 'strict',
  threshold: 0,
  format: ['javascript', 'typescript', 'jsx', 'tsx'],
  ignore: sharedExclusionPatterns,
};
