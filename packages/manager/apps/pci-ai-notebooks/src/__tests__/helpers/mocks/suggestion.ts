import { Suggestions } from '@/types/orderFunnel';

export const mockedSuggestion: Suggestions[] = [
  {
    region: 'GRA',
    ressources: {
      nb: 1,
      flavor: 'l4-1-gpu',
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
