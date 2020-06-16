import { bootstrapApplication } from '@ovh-ux/manager-core';
import { fetchConfig } from './config';

function fetchFragments(config) {
  return Promise.all(
    config.fragments.map((fragment) =>
      fragment.fetch().then((loaded) => ({
        ...fragment,
        loaded,
      })),
    ),
  ).then((fragments) => ({
    ...config,
    fragments,
  }));
}

function injectTemplate(config) {
  document.body.innerHTML = config.template;
  config.fragments
    .filter(({ loaded }) => loaded)
    .forEach((fragment) => {
      const element = document.querySelector(`[data-fragment=${fragment.id}]`);
      if (element) {
        fragment.bootstrap(fragment, element);
      }
    });
}

function frontendAPI() {
  return {
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
  };
}

function boot() {
  return bootstrapApplication()
    .then(fetchConfig)
    .then(fetchFragments)
    .then(injectTemplate)
    .then(frontendAPI);
}

export default boot;
export { boot };
