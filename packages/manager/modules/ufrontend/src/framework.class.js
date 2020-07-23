import { fetchConfiguration as fetch2APIConfig } from '@ovh-ux/manager-config';
import Deferred from './utils/deferred.class';
import OvhMicroFrontendApplicationAPI from './api.application.class';
import OvhMicroFrontendFragmentAPI from './api.fragment.class';

class OvhMicroFrontend {
  constructor() {
    this.fragments = {};
    this.messages = [];
    this.listeners = [];
    this.config = new Deferred();
  }

  init() {
    return fetch2APIConfig().then((config) => {
      this.config.resolve(config);
      return {
        config,
        ufrontend: new OvhMicroFrontendApplicationAPI(this),
      };
    });
  }

  getConfig() {
    return this.config.promise;
  }

  addListener(callback) {
    this.listeners.push(callback);
    this.processMessageQueue();
    return function unlisten() {
      const index = this.listeners.indexOf(callback);
      if (index >= 0) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emitMessage(data, { timeout } = { timeout: 5000 }) {
    const now = new Date().getTime();
    this.messages.push({
      data,
      isExpired: () => new Date().getTime() > now + timeout,
      sent: [],
    });
    this.processMessageQueue();
  }

  processMessageQueue() {
    const pendingMessages = [];
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
  onFragmentRegister(fragment) {
    // the fragment code has not been dynamically loaded yet
    // we are registering a deferred value
    this.fragments[fragment.id] = new Deferred(fragment);
  }

  /** Called by the fragment code */
  onFragmentLoaded({ id, resolve, reject }) {
    const fragment = this.fragments[id];
    if (!fragment) {
      throw new Error(
        `onFragmentLoaded called by unregistred fragment '${id}'`,
      );
    }
    // ensure that the fragment is not loaded yet
    if (fragment.isPending()) {
      Promise.all([this.getConfig(), fragment.resolve()])
        .then(([config, resolvedFragment]) => {
          // render the fragment into the dom
          resolve({
            parent: resolvedFragment,
            config,
            ufrontend: new OvhMicroFrontendFragmentAPI(this, resolvedFragment),
          });
        })
        .catch(reject);
    }
  }

  onFragmentUnloaded(id) {
    // unregister the fragment
    delete this.fragments[id];
  }
}

export default OvhMicroFrontend;
