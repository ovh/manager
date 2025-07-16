import { sharedExclusionPatterns } from './shared-exclusion-patterns';

export const madgeDefaultOptions = {
  fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  excludeRegExp: sharedExclusionPatterns.map((glob) =>
    glob.replace(/\*\*/g, '.*').replace(/\*/g, '.*'),
  ),
};
