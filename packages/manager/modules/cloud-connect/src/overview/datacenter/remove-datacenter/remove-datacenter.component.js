import controller from './remove-datacenter.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnectId: '<',
    cloudConnect: '<',
    datacenter: '<',
    datacenterId: '<',
    goBack: '<',
    popId: '<',
    tasksHref: '<',
  },
  controller,
  template,
};
