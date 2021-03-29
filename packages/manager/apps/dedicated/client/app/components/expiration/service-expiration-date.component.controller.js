import get from 'lodash/get';
import isString from 'lodash/isString';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';

(() => {
  class ServiceExpirationDateComponentCtrl {
    constructor($scope, $rootScope, constants, coreConfig) {
      $scope.tr = $rootScope.tr;
      $scope.i18n = $rootScope.i18n;
      this.constants = constants;
      this.coreConfig = coreConfig;
      this.inline = false;
    }

    $onInit() {
      const hasValidServiceInfos = angular.isObject(this.serviceInfos);
      const hasValidServiceName = isString(this.serviceName);
      if (!hasValidServiceInfos || !hasValidServiceName) {
        throw new Error('serviceExpirationDate: Missing parameter(s)');
      }
    }

    getRenewUrl() {
      return this.coreConfig.getRegion() === 'CA'
        ? this.getOrderUrl()
        : this.getAutoRenewUrl();
    }

    getOrderUrl() {
      return URI.expand(this.constants.renew, {
        serviceName: this.serviceName,
      }).toString();
    }

    getAutoRenewUrl() {
      const params = {
        searchText: this.serviceName,
      };
      if (isString(this.serviceType)) {
        params.selectedType = this.serviceType;
      }

      return buildURL('dedicated', '#/billing/autoRenew', params);
    }

    getDate() {
      if (this.isAutoRenew()) {
        return moment(this.serviceInfos.expiration).add(1, 'days').format();
      }
      return this.serviceInfos.expiration;
    }

    isAutoRenew() {
      return (
        get(this.serviceInfos, 'renew.automatic') ||
        get(this.serviceInfos, 'renew.forced')
      );
    }
  }
  angular
    .module('directives')
    .controller(
      'ServiceExpirationDateComponentCtrl',
      ServiceExpirationDateComponentCtrl,
    );
})();
