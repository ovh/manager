import { fetchConfiguration as fetch2APIConfig } from '@ovh-ux/manager-config';
import Deferred from './utils/deferred.class';
import pollValue from './utils/pollvalue';
import OvhMicroFrontendApplicationAPI from './api.application.class';
import OvhMicroFrontendFragmentAPI from './api.fragment.class';

class OvhMicroFrontend {
  constructor() {
    this.fragments = {};
    this.shared = {};
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

  shareFragmentData({ fragment, data }) {
    this.shared[fragment.id] = data;
  }

  shareApplicationData(data) {
    this.shared.application = data;
  }

  getFragmentSharedData(id, timeout = 0) {
    return pollValue({
      getValue: () => this.shared[id],
      timeout,
      timeoutError: new Error(`getFragmentSharedData '${id}' timeout`),
    });
  }

  getApplicationSharedData(timeout = 0) {
    return pollValue({
      getValue: () => this.shared.application,
      timeout,
      timeoutError: new Error(`getApplicationSharedData timeout`),
    });
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
