import * as ai from '@/types/cloud/project/ai';

export const mockedFramework: ai.capabilities.notebook.Framework = {
  description: 'ovhcloud oneforall',
  docUrl: 'docURl',
  id: 'one-for-all',
  logoUrl: 'logo',
  name: 'one-for-all',
  versions: ['version'],
};

export const mockedFrameworkBis: ai.capabilities.notebook.Framework = {
  description: 'tensorflow',
  docUrl: 'docURl1',
  id: 'tensorflow',
  logoUrl: 'logoBis',
  name: 'Tensorflow',
  versions: ['ten1', 'ten2'],
};
