const Deferred = () => {
  const defer = {};
  defer.promise = new Promise(function resolver(resolve, reject) {
    defer.resolve = resolve.bind(this);
    defer.reject = reject.bind(this);
  });
  return defer;
};

class Frontend {
  constructor() {
    this.config = Deferred();
    this.template = Deferred();
    this.application = Deferred();
    this.fragments = Deferred();
    this.verbose = window.location.hostname === 'localhost';
    this.creationTime = performance.now();
  }

  debug(message, data) {
    if (this.verbose) {
      if (data) {
        console.log(`frontend > ${message}`, data);
      } else {
        console.log(`frontend > ${message}`);
      }
    }
  }

  setConfig(config) {
    this.debug('configuration loaded', config);
    this.config.resolve(config);
  }

  getConfig() {
    return this.config.promise;
  }

  setTemplate(template) {
    this.debug(`template loaded:`, template);
    this.template.resolve(template);
  }

  getTemplate() {
    return this.template.promise;
  }

  setApplication(app) {
    this.debug(`application loaded: '${app}'`);
    this.application.resolve(app);
  }

  getApplication() {
    return this.application.promise;
  }

  setFragments(fragments) {
    const fragmentsMap = {};
    fragments.forEach((id) => {
      fragmentsMap[id] = Deferred();
    });
    this.debug('fragments parsed from template', fragments);
    this.fragments.resolve(fragmentsMap);
  }

  getFragments() {
    return this.fragments.promise;
  }

  getFragment(id) {
    return this.getFragments().then((fragments) => {
      return fragments[id].promise;
    });
  }

  setFragment(id) {
    return this.getFragments().then((fragments) => {
      this.debug(`fragment loaded: '${id}'`);
      return fragments[id].resolve(id);
    });
  }

  isLoaded() {
    return this.getApplication()
      .then(() => this.getFragments())
      .then((fragmentsMap) => Object.keys(fragmentsMap))
      .then((ids) => Promise.all(ids.map((id) => this.getFragment(id))));
  }
}

function getFrontend() {
  if (!window.ovhMicroFrontend) {
    window.ovhMicroFrontend = new Frontend();
  }
  return window.ovhMicroFrontend;
}

export default getFrontend;
