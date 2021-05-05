import get from 'lodash/get';
import isString from 'lodash/isString';
import angular from 'angular';
import 'moment';

import { RENEW_URL } from './service-expiration-date.component.constant';

export default class {
  /* @ngInject */
  constructor($q, $scope, $rootScope, coreConfig, coreURLBuilder) {
    this.$q = $q;
    $scope.tr = $rootScope.tr;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    if (!angular.isObject(this.serviceInfos) || !isString(this.serviceName)) {
      throw new Error('serviceExpirationDate: Missing parameter(s)');
    }

    this.loading = true;
    this.subsidiary = null;

    return this.$q
      .when(this.coreConfig.getUser())
      .then(({ ovhSubsidiary }) => {
        this.subsidiary = ovhSubsidiary;
        this.orderUrl = `${RENEW_URL[this.coreConfig.getRegion()]}${
          this.serviceInfos.domain
        }`;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getCancelTerminationUrl() {
    if (this.coreConfig.isRegion(['EU', 'CA'])) {
      const params = {
        searchText: this.serviceName,
      };
      if (isString(this.serviceType)) {
        params.selectedType = this.serviceType;
      }

      return this.coreURLBuilder.buildURL(
        'dedicated',
        '#/billing/autorenew',
        params,
      );
    }
    return '';
  }

  getOrderUrl() {
    return this.orderUrl;
  }

  getExpirationClass() {
    if (this.isExpired()) {
      return 'expired';
    }

    if (this.isAutoRenew()) {
      return '';
    }

    const diff = moment(this.serviceInfos.expiration).diff(moment(), 'days');

    if (diff >= 7 && diff <= 15) {
      return 'expired15';
    }
    if (diff >= 1 && diff < 7) {
      return 'expired7';
    }
    if (diff <= 0) {
      return 'expired';
    }
    return '';
  }

  isInAutoRenew() {
    return (
      get(this.serviceInfos, 'renew.automatic') ||
      get(this.serviceInfos, 'renew.forced')
    );
  }

  shouldDeleteAtExpiration() {
    return get(this.serviceInfos, 'renew.deleteAtExpiration');
  }

  isExpired() {
    const diff = moment(this.serviceInfos.expiration).diff(moment(), 'days');
    return (
      this.serviceInfos.expiration &&
      (diff <= 0 || this.serviceInfos.status === 'expired')
    );
  }
}
