import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import snapshotController from './snapshot/controller';
import snapshotTemplate from './snapshot/template.html';

import controller from './controller';
import template from './template.html';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectComputeVolume';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.compute.volume', {
      url: '/volume',
      sticky: true,
      views: {
        cloudProjectCompute: {
          template,
          controller,
          controllerAs: 'CloudProjectComputeVolumeCtrl',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  })
  .controller('CloudProjectComputeVolumeSnapshotAddCtrl', snapshotController)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/volume/snapshot/template.html', snapshotTemplate);
  });

export default moduleName;
