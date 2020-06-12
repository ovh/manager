import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import { URL_WHITELIST } from './vnc.constants';

import component from './vnc.component';
import routing from './vnc.routing';

const moduleName = 'ovhManagerPciInstancesInstanceVNC';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .config(
    /* @ngInject */ ($sceDelegateProvider) =>
      $sceDelegateProvider.resourceUrlWhitelist([
        ...$sceDelegateProvider.resourceUrlWhitelist(),
        ...URL_WHITELIST,
      ]),
  )
  .component('pciInstancesInstanceVNC', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
