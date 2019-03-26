import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import dialog from './dialog';

import directive from './directive';
import service from './service';

const moduleName = 'ovhManagerPciProjectComputeInfrastructurePrivateNetwork';

angular
  .module(moduleName, [
    dialog,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .directive('privateNetworkList', directive)
  .service('CloudProjectComputeInfrastructurePrivateNetworkService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
