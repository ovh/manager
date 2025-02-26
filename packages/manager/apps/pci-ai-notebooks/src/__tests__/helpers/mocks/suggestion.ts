import {
  AppSuggestions,
  JobSuggestions,
  Suggestions,
} from '@/types/orderFunnel';

export const mockedNotebookSuggestion: Suggestions[] = [
  {
    region: 'GRA',
    ressources: {
      nb: 1,
      flavor: 'flavorCPUId',
    },
    framework: {
      id: 'one-for-all',
      version: 'v98-ovh.beta.1',
    },
    editorId: 'jupyterlab',
    unsecureHttp: false,
  },
  {
    region: 'BHS',
    ressources: {
      nb: 1,
      flavor: 'ai1-le-1-gpu',
    },
    framework: {
      id: 'one-for-all',
      version: 'v98-ovh.beta.1',
    },
    editorId: 'jupyterlab',
    unsecureHttp: false,
  },
];

export const mockedJobSuggetions: JobSuggestions[] = [
  {
    region: 'GRA',
    ressources: {
      nb: 1,
      flavor: 'flavorCPUId',
    },
    image: 'ovhcom/ai-training-mxnet:1.5.0',
    unsecureHttp: false,
  },
  {
    region: 'BHS',
    ressources: {
      nb: 1,
      flavor: 'ai1-le-1-gpu',
    },
    image: 'ovhcom/ai-training-mxnet:1.5.0',
    unsecureHttp: false,
  },
];

export const mockedAppSuggetions: AppSuggestions[] = [
  {
    region: 'GRA',
    ressources: {
      nb: 1,
      flavor: 'flavorCPUId',
    },
    unsecureHttp: false,
  },
  {
    region: 'BHS',
    ressources: {
      nb: 1,
      flavor: 'ai1-le-1-gpu',
    },
    unsecureHttp: false,
  },
];
