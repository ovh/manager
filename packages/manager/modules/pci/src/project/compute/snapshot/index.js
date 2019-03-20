import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

import addController from './add/controller';
import addTemplate from './add/template.html';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectComputeSnapshot';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.validate',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.snapshot', {
        url: '/snapshot',
        sticky: true,
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: 'CloudProjectComputeSnapshotCtrl',
          },
        },
      });
  })
  .controller('CloudProjectComputeSnapshotAddCtrl', addController)
  .service('CloudProjectComputeSnapshotPriceService', service)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/snapshot/add/template.html', addTemplate);
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
