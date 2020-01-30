import template from './index.html';

export default {
  name: 'pciProjectNew',
  template,
  bindings: {
    cancelHref: '<',
    getExpressOrderLink: '<',
    model: '<',
  },
};
