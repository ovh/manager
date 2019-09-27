import controller from './options.controller';
import template from './options.html';

export default {
  bindings: {
    $transition$: '<',
    orderableServicePacks: '<',
    servicePacks: '<',
  },
  controller,
  template,
};
