import angular from 'angular';

import OvhContactsService from './ovh-contacts.service';

export default class ovhContactsProvider {
  constructor() {
    this.target = 'EU';
  }

  setTarget(target) {
    if (angular.isString(target)) {
      this.target = target;
    }

    return target;
  }

  /* @ngInject */
  $get($q, $translate, OvhApiMe, OvhApiNewAccount) {
    return new OvhContactsService($q, $translate, OvhApiMe, OvhApiNewAccount, this.target);
  }
}
