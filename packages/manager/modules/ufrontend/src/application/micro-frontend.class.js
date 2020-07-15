import { fetchConfiguration as fetch2APIConfig } from '@ovh-ux/manager-config';
import Deferred from './deferred.class';

class OvhMicroFrontend {
  constructor() {
    this.fragments = {};
    this.config = new Deferred();
  }

  init() {
    return fetch2APIConfig().then((config) => {
      this.config.resolve(config);
      return config;
    });
  }

  getConfig() {
    return this.config.promise;
  }

  onFragmentRegister(fragment) {
    this.fragments[fragment.id] = new Deferred(fragment);
  }

  onFragmentLoaded({ id, resolve, reject }) {
    const fragment = this.fragments[id];
    if (fragment.isPending()) {
      Promise.all([this.getConfig(), fragment.resolve()])
        .then(([config, resolvedFragment]) => {
          resolvedFragment.instanciateFragment(resolve, config);
        })
        .catch(reject);
    }
  }

  onFragmentUnloaded(id) {
    delete this.fragments[id];
  }
}

export default OvhMicroFrontend;
