import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './download-openrc.component';
import routing from './download-openrc.routing';

const moduleName = 'ovhManagerPciUsersDownloadOpenRc';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectUsersDownloadOpenRc', component)
  .config(
    /* @ngInject */ ($compileProvider) => {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|s?ftp|mailto|tel|file|data):/,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
