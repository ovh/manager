import controller from './datacenter-add.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    datacenters: '<',
    goBack: '<',
    popId: '<',
    tasksHref: '<',
  },
  controller,
  template,
};
