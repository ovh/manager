import { Environment } from '@ovh-ux/manager-config/dist/types/environment/environment';
import { fetchConfiguration as fetch2APIConfig } from '@ovh-ux/manager-config';
import Deferred, { Callback, CustomPromise } from './utils/deferred.class';
import OvhMicroFrontendApplicationAPI from './api.application.class';
import OvhMicroFrontendFragmentAPI from './api.fragment.class';
import OvhFragment from './fragment.class';
import {
  EnvironmentEventMessage,
  FragmentConfig,
  FragmentState,
} from './ufrontend';

export default class OvhMicroFrontend {
  private environment: CustomPromise<Environment>;

  private fragments: Record<string, CustomPromise<OvhFragment>>;

  private listeners: Array<Callback>;

  private messages: Array<EnvironmentEventMessage>;

  constructor() {
    this.fragments = {};
    this.messages = [];
    this.listeners = [];
    this.environment = new Deferred<Environment>().defer;
  }

  init(applicationName: string): Promise<FragmentConfig> {
    return fetch2APIConfig(applicationName).then((environment) => {
      this.environment.resolve(environment);
      return {
        environment,
        ufrontend: new OvhMicroFrontendApplicationAPI(this),
      };
    });
  }

  getEnvironment(): Promise<Environment> {
    return this.environment.promise;
  }

  addListener(callback: Callback): Callback {
    this.listeners.push(callback);
    this.processMessageQueue();
    return function unlisten() {
      const index = this.listeners.indexOf(callback);
      if (index >= 0) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emitMessage(data: unknown, { timeout } = { timeout: 5000 }): void {
    const now = new Date().getTime();
    this.messages.push({
      data,
      isExpired: () => new Date().getTime() > now + timeout,
      sent: [],
    });
    this.processMessageQueue();
  }

  processMessageQueue(): void {
    const pendingMessages = [] as EnvironmentEventMessage[];
    this.messages.forEach((message) => {
      if (!message.isExpired()) {
        pendingMessages.push(message);
        this.listeners.forEach((callback) => {
          if (!message.sent.includes(callback)) {
            callback(message.data);
            message.sent.push(callback);
          }
        });
      }
    });
    this.messages = pendingMessages;
  }

  /** Called by fragment web-components at initialization */
  onFragmentRegister(fragment: OvhFragment): void {
    // the fragment code has not been dynamically loaded yet
    // we are registering a deferred value
    this.fragments[fragment.id] = new Deferred(fragment).defer;
  }

  /** Called by the fragment code */
  onFragmentLoaded({ id, resolve, reject }: FragmentState): void {
    const fragment = this.fragments[id];
    if (!fragment) {
      throw new Error(
        `onFragmentLoaded called by unregistred fragment '${id}'`,
      );
    }
    // ensure that the fragment is not loaded yet
    if (fragment.isPending()) {
      Promise.all([this.getEnvironment(), fragment.resolve()])
        .then(([environment, resolvedFragment]) => {
          // render the fragment into the dom
          resolve({
            parent: resolvedFragment,
            environment,
            ufrontend: new OvhMicroFrontendFragmentAPI(this, resolvedFragment),
          });
        })
        .catch(reject);
    }
  }

  onFragmentUnloaded(id: string): void {
    // unregister the fragment
    delete this.fragments[id];
  }
}
