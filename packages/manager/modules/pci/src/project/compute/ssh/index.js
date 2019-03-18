import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectComputeSsh';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.ssh', {
        url: '/ssh',
        sticky: true,
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: '$ctrl',
          },
        },
      });
  })
  .service('CloudProjectSSHKeyService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
