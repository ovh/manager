import angular from 'angular';

import ovhManagerCore from '@ovh-ux/manager-core';

import routing from './telecom-telephony-guides.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountGuides';

angular
  .module(moduleName, [ovhManagerCore])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
