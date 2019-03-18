import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

// import './index.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureOpenstackClient';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .controller('CloudProjectComputeInfrastructureOpenstackClientCtrl', controller)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/infrastructure/openstackClient/template.html', template);
  })
  .service('CloudProjectComputeInfrastructureOpenstackClientService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
