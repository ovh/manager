import * as ai from '@/types/cloud/project/ai';

export const mockedFramework: ai.notebook.Framework = {
  description: 'description',
  docUrl: 'docURl',
  id: 'frameworkId',
  logoUrl: 'logo',
  name: 'FrameworkName',
  versions: ['version'],
};

export const mockedFrameworkBis: ai.notebook.Framework = {
  description: 'description1',
  docUrl: 'docURl1',
  id: 'frameworkIdBis',
  logoUrl: 'logoBis',
  name: 'FrameworkNameBis',
  versions: ['version'],
};

export const mockedFrameworkTer: ai.notebook.Framework = {
  description: 'description1',
  docUrl: '',
  id: 'frameworkIdBis',
  logoUrl: 'logoBis',
  name: 'FrameworkNameBis',
  versions: ['version1', 'version2', 'version3'],
};
