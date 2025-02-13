import {
  AppSuggestions,
  JobSuggestions,
  Suggestions,
} from '@/types/orderFunnel';

export const tempSuggestionsForNotebook: Suggestions[] = [
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

export const tempSuggestionsForJob: JobSuggestions[] = [
  {
    region: 'GRA',
    ressources: {
      nb: 1,
      flavor: 'ai1-1-cpu',
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

export const tempSuggestionsForApp: AppSuggestions[] = [
  {
    region: 'GRA',
    ressources: {
      nb: 1,
      flavor: 'ai1-1-cpu',
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
