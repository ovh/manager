import angular from 'angular';

import controller from './telecom-telephony-service-fax-customDomains.controller';

const moduleName = 'ovhManagerTelephonyServiceFaxCustomDomains';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceFaxCustomDomainsCtrl', controller);

export default moduleName;
