import * as ai from '@/types/cloud/project/ai';

export const mockedEditor: ai.capabilities.notebook.Editor = {
  description: 'editor jupyter',
  docUrl: 'https://docurl',
  id: 'jupyterlab',
  logoUrl: 'logo',
  name: 'Jupyterlab',
  versions: ['version'],
};

export const mockedEditorBis: ai.capabilities.notebook.Editor = {
  description: 'editor jupyter colab',
  docUrl: 'docURl1',
  id: 'jupyterlabcollaborative',
  logoUrl: 'logoBis',
  name: 'Jupyterlabcollaboratives',
  versions: ['version'],
};
