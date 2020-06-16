export default {
  id: 'navbar',
  uri: '/navbar',
  fetch: () =>
    import('@ovh-ux/manager-navbar').then(({ default: data }) => data),
  bootstrap: (fragment, element) => {
    /* eslint-disable no-param-reassign */
    element.innerHTML = `
          <ovh-manager-navbar
              data-navbar-options="{
                  universe: 'hub',
                  version: 'beta',
                  toggle: {
                      event: 'sidebar:loaded',
                  },
              }"
              data-sidebar-links="{}"
          ></ovh-manager-navbar>
        `;
    angular.bootstrap(element, [fragment.loaded, 'oui']);
    /* eslint-enable no-param-reassign */
  },
};
