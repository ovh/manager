import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './download-rclone.component';
import routing from './download-rclone.routing';

const moduleName = 'ovhManagerPciUsersDownloadRclone';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectUsersDownloadRclone', component)
  .config(
    /* @ngInject */ ($compileProvider) => {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|s?ftp|mailto|tel|file|data):/,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
