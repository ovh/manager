import { Environment } from '@ovh-ux/manager-config/dist/types/environment/environment';
import OvhMicroFrontendApplicationAPI from './api.application.class';
import OvhMicroFrontendFragmentAPI from './api.fragment.class';
import OvhMicroFrontend from './framework.class';
import { Callback, Reject, Resolve, VoidResolve } from './utils/deferred.class';

export interface FragmentConfig {
  parent?: HTMLElement;
  environment?: Environment;
  ufrontend?: OvhMicroFrontendFragmentAPI | OvhMicroFrontendApplicationAPI;
}

export interface EnvironmentEventMessage {
  data: unknown;
  isExpired: () => boolean | boolean;
  sent: Array<Callback>;
}

export interface FragmentState {
  id: string;
  resolve: Resolve<FragmentConfig> | VoidResolve<FragmentConfig>;
  reject: Reject;
}

interface EnvironmentWebComponents {
  _batchCustomElements: Callback;
  ready: boolean;
  waitFor: Callback;
}

declare global {
  interface Window {
    ovhMicroFrontend: OvhMicroFrontend;
    WebComponents: EnvironmentWebComponents;
  }
}
