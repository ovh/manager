import ShellClient from '../client/shell-client';

import { i18nClientApi, i18n } from './i18n';
import {
  routingClientApi,
  initRoutingConfiguration,
  initRouting,
} from './routing';

export function getPublicPluginApi(shellClient: ShellClient) {
  return {
    i18n: i18nClientApi(shellClient),
    routing: routingClientApi(shellClient),
  };
}

export default {
  i18n,
  routing: {
    initRoutingConfiguration,
    initRouting,
  },
};
