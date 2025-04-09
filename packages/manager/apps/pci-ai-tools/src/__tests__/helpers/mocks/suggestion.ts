import { NotebookSuggestions } from '@/types/orderFunnel';

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
