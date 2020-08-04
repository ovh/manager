import template from './template.html';

export default {
  template,
  bindings: {
    addExtra: '&',
    cloudConnect: '<',
    datacenter: '<',
    removeDatacenter: '&',
  },
};
