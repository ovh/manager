import { fetchConfiguration } from '@ovh-ux/manager-config';
import EventEmitter from 'eventemitter3';

const ovhMicroFrontend = window.ovhMicroFrontend || {
  events: new EventEmitter(),
  pendingMessages: [],
  partsLoading: 1,
  notifyLoadPart: () => {
    ovhMicroFrontend.partsLoading += 1;
  },
  notifyPartLoaded: () => {
    ovhMicroFrontend.partsLoading -= 1;
    if (ovhMicroFrontend.partsLoading === 0) {
      ovhMicroFrontend.flushPendingMessages();
    }
  },
  isLoaded: () => ovhMicroFrontend.partsLoading === 0,
  flushPendingMessages: () => {
    ovhMicroFrontend.pendingMessages.forEach(({ id, message, data }) => {
      ovhMicroFrontend.events.emit(`${id}.${message}`, data);
    });
  },
};
window.ovhMicroFrontend = ovhMicroFrontend;

function fetchManifest() {
  return fetch('/ufrontend/manifest.json').then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(
      `Cannot fetch 'manifest.json', is '@ovh-ux/manager-ufrontend' application started?`,
    );
  });
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
      ovhMicroFrontend.config = config;
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
    ovhMicroFrontend.notifyLoadPart();
  });
  return {
    ...config,
    fragments,
  };
}

const getMessenger = (id) => ({
  on: (message, callback) => {
    ovhMicroFrontend.events.on(message, callback);
  },
  emit: (message, data) => {
    if (ovhMicroFrontend.isLoaded()) {
      ovhMicroFrontend.events.emit(`${id}.${message}`, data);
    } else {
      ovhMicroFrontend.pendingMessages.push({ id, message, data });
    }
  },
});

const getFragmentApi = () => ({
  register: (id, installFragment) => {
    const element = document.querySelector(`[data-fragment=${id}]`);
    if (element && installFragment instanceof Function) {
      Promise.resolve(
        installFragment(element, ovhMicroFrontend.config, getMessenger(id)),
      ).then(ovhMicroFrontend.notifyPartLoaded);
    }
  },
});

const createApplicationApi = () => ({
  installAngularJSApplication: ({ angular, modules, template }) => {
    const container = document.querySelector('[data-application]');
    const appRoot = document.createElement('div');
    appRoot.setAttribute('data-ng-app', 'app');
    appRoot.innerHTML = template;
    container.appendChild(appRoot);
    angular.module('app', [].concat(modules));
    angular.bootstrap(appRoot, ['app']);
    ovhMicroFrontend.notifyPartLoaded();
  },
  messenger: getMessenger('application'),
});

function getApplicationApi() {
  return bootstrapApplication()
    .then(fetchTemplate)
    .then(fetchFragments)
    .then(createApplicationApi);
}

export { getApplicationApi, getFragmentApi };
