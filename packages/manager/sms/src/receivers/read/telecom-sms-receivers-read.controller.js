import angular from 'angular';
import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';

export default class {
  /* @ngInject */
  constructor($stateParams, $translate, $uibModalInstance, receiver, csv) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.receiver = receiver;
    this.csv = csv;
  }

  $onInit() {
    this.model = {
      receiver: angular.copy(this.receiver),
      csv: angular.copy(this.csv),
    };
  }

  /**
     * Set filename base on service name and description.
     * @return {String}
     */
  setFilename() {
    return `${kebabCase([
      this.$stateParams.serviceName,
      this.$translate.instant('sms_tabs_contacts'),
      get(this.model.receiver, 'description', ''),
    ].join())}.csv`;
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
