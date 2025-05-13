import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './manage-notifications.component';

const moduleName = 'ovhCloudConnectManageNotificationsComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhCloudConnectManageNotifications', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
