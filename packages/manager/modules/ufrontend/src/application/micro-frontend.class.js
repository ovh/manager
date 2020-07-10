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
    });
  }

  getConfig() {
    return this.config.promise;
  }

  onFragmentRegister(fragment) {
    this.fragments[fragment.id] = new Deferred(fragment);
  }

  onFragmentLoaded({ id, callback }) {
    const fragment = this.fragments[id];
    if (fragment.isPending()) {
      Promise.all([this.getConfig(), fragment.resolve()]).then(
        ([config, fragmentElement]) => {
          callback({ element: fragmentElement }, config);
        },
      );
    }
  }

  onFragmentUnloaded(id) {
    delete this.fragments[id];
  }
}

export default OvhMicroFrontend;
