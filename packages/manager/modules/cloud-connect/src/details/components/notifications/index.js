import angular from 'angular';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhCloudConnectDetailsNotificationsModule';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('ovhCloudConnectNotifications', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
