import {
  AppSuggestions,
  JobSuggestions,
  Suggestions,
} from '@/types/orderFunnel';

const baseGRA = {
  region: 'GRA',
  ressources: {
    nb: 1,
    flavor: 'ai1-1-cpu',
  },
  unsecureHttp: false,
};

const baseBHS = {
  region: 'BHS',
  ressources: {
    nb: 1,
    flavor: 'ai1-le-1-gpu',
  },
  unsecureHttp: false,
};

export const mockedSuggestionsForNotebook: Suggestions[] = [
  {
    ...baseGRA,
    framework: {
      id: 'one-for-all',
      version: 'v98-ovh.beta.1',
    },
    editorId: 'jupyterlab',
  },
  {
    ...baseBHS,
    framework: {
      id: 'one-for-all',
      version: 'v98-ovh.beta.1',
    },
    editorId: 'jupyterlab',
  },
];

export const mockedSuggestionsForJob: JobSuggestions[] = [
  {
    ...baseGRA,
    image: 'ovhcom/ai-training-mxnet:1.5.0',
  },
  {
    ...baseBHS,
    image: 'ovhcom/ai-training-mxnet:1.5.0',
  },
];

export const mockedSuggestionsForApp: AppSuggestions[] = [baseGRA, baseBHS];
