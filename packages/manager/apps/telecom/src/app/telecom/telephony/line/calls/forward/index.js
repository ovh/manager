import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import routing from './forward.routing';
import factory from './forward.factory';
import service from './forward.service';

import natureFactory from './nature/nature.factory';
import phoneNumberFactory from './phoneNumber/phone-number.factory';

const moduleName = 'ovhManagerTelecomTelephonyLineCallsForward';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
  ])
  .service('TelecomTelephonyLineCallsForwardService', service)
  .factory('TelecomTelephonyLineCallsForward', factory)
  .factory('TelecomTelephonyLineCallsForwardNature', natureFactory)
  .factory('TelecomTelephonyLineCallsForwardPhoneNumber', phoneNumberFactory)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
