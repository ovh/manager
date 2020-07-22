import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import accountMigrationNotification from './notification.component';

const moduleName = 'accountMigrationNotification';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    translate,
  ])
  .component('accountMigrationNotification', accountMigrationNotification)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
