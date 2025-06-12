import {
  AppSuggestions,
  JobSuggestions,
  NotebookSuggestions,
} from '@/types/orderFunnel';

const baseGRA = {
  region: 'GRA',
  resources: {
    quantity: 1,
    flavorId: 'ai1-1-cpu',
  },
  unsecureHttp: false,
};

const baseBHS = {
  region: 'BHS',
  resources: {
    quantity: 1,
    flavorId: 'ai1-le-1-gpu',
  },
  unsecureHttp: false,
};

export const mockedSuggestionsForNotebook: NotebookSuggestions = {
  defaultRegion: 'GRA',
  suggestions: [
    {
      ...baseGRA,
      framework: {
        id: 'one-for-all',
      },
      editor: {
        id: 'jupyterlab',
      },
    },
    {
      ...baseBHS,
      framework: {
        id: 'one-for-all',
      },
      editor: {
        id: 'jupyterlab',
      },
    },
  ],
};

export const mockedSuggestionsForJob: JobSuggestions = {
  defaultRegion: 'GRA',
  suggestions: [
    {
      ...baseGRA,
      presetImage: 'ovhcom/ai-training-mxnet:1.5.0',
    },
    {
      ...baseBHS,
      presetImage: 'ovhcom/ai-training-mxnet:1.5.0',
    },
  ],
};

export const mockedSuggestionsForApp: AppSuggestions = {
  defaultRegion: 'GRA',
  suggestions: [
    {
      ...baseGRA,
    },
    {
      ...baseBHS,
    },
  ],
};
