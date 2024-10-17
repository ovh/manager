import * as ai from '@/types/cloud/project/ai';

export function humanizeFramework(
  framework: ai.capabilities.notebook.Framework,
) {
  switch (framework.id) {
    case 'alicebob':
      return 'Alice & Bob';
    case 'myqlm':
      return 'myQLM';
    case 'autogluon-mxnet':
      return 'Autogluon';
    case 'fastai':
      return 'Fastai';
    case 'huggingface':
      return 'Huggin Face';
    case 'colatible':
      return 'Miniconda';
    case 'one-for-all':
      return 'One for all';
    case 'perceval':
      return 'Perceval';
    default:
      return framework.name;
  }
}
