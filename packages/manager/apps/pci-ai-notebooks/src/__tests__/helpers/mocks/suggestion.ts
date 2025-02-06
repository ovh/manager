import { JobSuggestions, Suggestions } from '@/types/orderFunnel';

export const mockedSuggestion: Suggestions[] = [
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

export const mockedTempSuggestionForOrderFunnel: Suggestions[] = [
  {
    region: 'GRA',
    ressources: {
      nb: 1,
      flavor: 'ai1-1-cpu',
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

export const mockedTempJobSuggestionForOrderFunnel: JobSuggestions[] = [
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
