import controller from './add-extra.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    datacenterId: '<',
    datacenter: '<',
    extraType: '<',
    goBack: '<',
    popId: '<',
    tasksHref: '<',
  },
  controller,
  template,
};
