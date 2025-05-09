import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './dedicatedCloud-datacenter-virtualMachine.controller';
import template from './dedicatedCloud-datacenter-virtualMachine.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    datacenterId: '<',
    datacenter: '<',
    dedicatedCloud: '<',
    setMessage: '<',
    goToDeleteLicense: '<',
    goToSetLicense: '<',
  },
  controller,
  template,
};
