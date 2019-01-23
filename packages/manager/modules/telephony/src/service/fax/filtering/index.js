import angular from 'angular';

import controller from './telecom-telephony-service-fax-filtering.controller';

const moduleName = 'ovhManagerTelephonyServiceFaxFiltering';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceFaxFilteringCtrl', controller);

export default moduleName;
