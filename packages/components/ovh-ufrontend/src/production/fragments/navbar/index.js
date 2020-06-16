import 'whatwg-fetch';

export default {
  id: 'navbar',
  uri: '/navbar',
  fetch: () =>
    fetch('/fragment-navbar/index.html').then((response) => response.text()),
  bootstrap: (fragment, element) => {
    /* eslint-disable no-param-reassign */
    element.innerHTML = fragment.loaded;
    /* eslint-enable no-param-reassign */
    angular.bootstrap(element, [fragment.loaded]);
  },
};
