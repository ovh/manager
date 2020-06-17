import template from './template.html';

const HOSTNAME_REGIONS = {
  'www.ovh.com': 'EU',
  'ca.ovh.com': 'CA',
  'us.ovhcloud.com': 'US',
};

const bootstrapApplication = () => {
  document.body.innerHTML = template;

  return fetch('/engine/2api/configuration', {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.assign(
          `/auth?action=disconnect&onsuccess=${encodeURIComponent(
            window.location.href,
          )}`,
        );
      }
      return response.json();
    })
    .catch(() => ({
      region: HOSTNAME_REGIONS[window.location.hostname],
    }))
    .then((config) => ({
      ...config,
      template,
    }));
};

function fetchFragments(config) {
  const fragments = Array.from(
    document.querySelectorAll('[data-fragment]'),
  ).map((element) => element.getAttribute('data-fragment'));
  fragments.forEach((fragment) => {
    const script = document.createElement('script');
    script.src = `/fragment/${fragment}.js`;
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
    .then(fetchFragments)
    .then(frontendAPI);
}

const FragmentApi = {
  register: (id, installFragment) => {
    const element = document.querySelector(`[data-fragment=${id}]`);
    if (element && installFragment instanceof Function) {
      installFragment(element);
    }
  },
};

export { boot, FragmentApi };
