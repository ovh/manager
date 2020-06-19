import {
  attach as attachPreloader,
  detach as detachPreloader,
} from '@ovh-ux/manager-preloader';
import { fetchConfiguration as fetch2APIConfig } from '@ovh-ux/manager-config';
import getFrontend from './frontend';
import getMessenger from './messenger';

const frontend = getFrontend();
const messenger = getMessenger();

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

function fetchConfiguration() {
  frontend.debug('fetching configuration ...');
  return fetch2APIConfig().then((config) => {
    if (!config.manifest) {
      return fetchManifest().then((manifest) => ({
        ...config,
        manifest,
      }));
    }
    return config;
  });
}

function fetchTemplate() {
  return frontend.getConfig().then((config) => {
    frontend.debug(`fetching template '${config.manifest.template.index}' ...`);
    return fetch(config.manifest.template.index)
      .then((response) => response.text())
      .then((template) => {
        document.body.innerHTML = template;
        return document.body;
      });
  });
}

function parseFragments() {
  return frontend.getTemplate().then((template) =>
    frontend.getConfig().then((config) => {
      const fragments = Array.from(
        template.querySelectorAll('[data-fragment]'),
      ).map((element) => element.getAttribute('data-fragment'));
      fragments.forEach((fragment) => {
        if (fragment in config.manifest.fragment) {
          const script = document.createElement('script');
          script.src = config.manifest.fragment[fragment];
          document.querySelector('head').appendChild(script);
        }
      });
      return fragments;
    }),
  );
}

const createApplicationApi = (app, template) => ({
  installApplication: (installer) => {
    const container = template.querySelector('[data-application]');
    const appRoot = document.createElement('div');
    Promise.resolve(installer(appRoot)).then(() => {
      container.appendChild(appRoot);
    });
  },
  installAngularJSApplication: ({
    angular,
    modules,
    template: appTemplate,
  }) => {
    const container = template.querySelector('[data-application]');
    const appRoot = document.createElement('div');
    appRoot.setAttribute('data-ng-app', 'app');
    appRoot.innerHTML = appTemplate;
    container.appendChild(appRoot);
    angular.module('app', [].concat(modules));
    angular.bootstrap(appRoot, ['app']);
  },
  messenger: {
    on: (message, callback) => messenger.on(app, message, callback),
    emit: (message, data) => messenger.emit(app, message, data),
  },
});

function registerApplication(app, callback) {
  attachPreloader();
  frontend.isLoaded().then(detachPreloader);

  if (!(callback instanceof Function)) {
    throw new Error(
      `Given callback to install application '${app}' is not a function`,
    );
  }

  fetchConfiguration().then((config) => frontend.setConfig(config));
  fetchTemplate().then((template) => frontend.setTemplate(template));
  parseFragments().then((fragments) => frontend.setFragments(fragments));

  return Promise.all([frontend.getConfig(), frontend.getTemplate()]).then(
    ([config, template]) =>
      Promise.resolve(
        callback({
          api: createApplicationApi(app, template),
          config,
        }),
      ).then(() => frontend.setApplication(app)),
  );
}

export default registerApplication;
