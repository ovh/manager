import { fetchConfiguration } from '@ovh-ux/manager-config';

if (!window.ovhMicroFrontend) {
  window.ovhMicroFrontend = {};
}

const bootstrapApplication = () => {
  return fetchConfiguration().then((config) => {
    window.ovhMicroFrontend.config = config;
    return config;
  });
};

function fetchTemplate(config) {
  return fetch('/ufrontend/template/index.html')
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
    script.src = `/ufrontend/${fragment}/index.js`;
    document.getElementsByTagName('head')[0].appendChild(script);
  });
  return {
    ...config,
    fragments,
  };
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
    .then(fetchTemplate)
    .then(fetchFragments)
    .then(frontendAPI);
}

const FragmentApi = {
  register: (id, installFragment) => {
    const element = document.querySelector(`[data-fragment=${id}]`);
    if (element && installFragment instanceof Function) {
      installFragment(element, window.ovhMicroFrontend.config);
    }
  },
};

export { boot, FragmentApi };
