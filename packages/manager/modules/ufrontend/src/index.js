import { fetchConfiguration } from '@ovh-ux/manager-config';
import EventEmitter from 'eventemitter3';

if (!window.ovhMicroFrontend) {
  window.ovhMicroFrontend = {
    events: new EventEmitter(),
  };
}

function fetchManifest() {
  return fetch('/ufrontend/manifest.json').then((response) => response.json());
}

const bootstrapApplication = () => {
  return fetchConfiguration()
    .then((config) => {
      if (!config.manifest) {
        return fetchManifest().then((manifest) => ({
          ...config,
          manifest,
        }));
      }
      return config;
    })
    .then((config) => {
      window.ovhMicroFrontend.config = config;
      return config;
    });
};

function fetchTemplate(config) {
  return fetch(config.manifest.template.index)
    .then((response) => response.text())
    .then((template) => {
      document.body.innerHTML = template;
    })
    .then(() => config);
}

function fetchFragments(config) {
  const fragments = Array.from(
    document.querySelectorAll('[data-fragment]'),
  ).map((element) => element.getAttribute('data-fragment'));
  fragments.forEach((fragment) => {
    const script = document.createElement('script');
    script.src = config.manifest.fragment[fragment];
    document.querySelector('head').appendChild(script);
  });
  return {
    ...config,
    fragments,
  };
}

const getMessenger = (id) => ({
  on: (message, callback) => {
    window.ovhMicroFrontend.events.on(message, callback);
  },
  emit: (message, data) => {
    window.ovhMicroFrontend.events.emit(message, {
      id,
      data,
    });
  },
});

const getFragmentApi = () => ({
  register: (id, installFragment) => {
    const element = document.querySelector(`[data-fragment=${id}]`);
    if (element && installFragment instanceof Function) {
      installFragment(
        element,
        window.ovhMicroFrontend.config,
        getMessenger(id),
      );
    }
  },
});

const getApplicationApi = () => ({
  installAngularJSApplication: (appModules, appTemplate) => {
    const container = document.querySelector('[data-application]');
    const appRoot = document.createElement('div');
    appRoot.setAttribute('data-ng-app', 'app');
    appRoot.innerHTML = appTemplate;
    container.appendChild(appRoot);
    angular.module('app', appModules);
    angular.bootstrap(appRoot, ['app']);
  },
  setApplicationTitle: (title) => {
    document.title = title;
  },
});

function boot() {
  return bootstrapApplication()
    .then(fetchTemplate)
    .then(fetchFragments)
    .then(getApplicationApi);
}

export { boot, getFragmentApi };
