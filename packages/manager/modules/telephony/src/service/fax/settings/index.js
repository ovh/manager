import angular from 'angular';

import controller from './telecom-telephony-service-fax-settings.controller';
import './telecom-telephony-service-fax-settings.less';

const moduleName = 'ovhManagerTelephonyServiceFaxSettings';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceFaxSettingsCtrl', controller);

export default moduleName;
