import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import snapshotController from './snapshot/controller';
import snapshotTemplate from './snapshot/template.html';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeVolume';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ui.validate',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.legacy.compute.volume', {
      url: '/volume',
      sticky: true,
      views: {
        cloudProjectCompute: {
          template,
          controller,
          controllerAs: 'CloudProjectComputeVolumeCtrl',
        },
      },
    });
  })
  .controller('CloudProjectComputeVolumeSnapshotAddCtrl', snapshotController)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/volume/snapshot/template.html', snapshotTemplate);
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
