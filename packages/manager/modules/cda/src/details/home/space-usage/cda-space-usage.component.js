import template from './cda-space-usage.component.html';

export default {
  template,
  bindings: {
    total: '<',
    available: '<',
    used: '<',
  },
};
