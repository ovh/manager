import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';

import WucServiceExpirationDateComponentCtrl from './service-expiration-date.component.controller';
import wucServiceExpirationDate from './service-expiration-date.component';
import SERVICE_EXPIRATION_DATE from './service-expiration-date.component.constant';

import './service-expiration-date.component.less';

const moduleName = 'wucExpiration';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    translate,
  ])
  .component('wucServiceExpirationDate', wucServiceExpirationDate)
  .controller(
    'WucServiceExpirationDateComponentCtrl',
    WucServiceExpirationDateComponentCtrl,
  )
  .constant('WUC_SERVICE_EXPIRATION_DATE', SERVICE_EXPIRATION_DATE)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
