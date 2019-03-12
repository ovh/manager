import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-ovh-jsplumb';

import diagram from './diagram';
import iacDeploy from './iac/deploy';
import list from './list';
import virtualMachine from './virtualMachine';
import volume from './volume';

import controller from './controller';
import template from './template.html';

import flavorService from './flavor.service';
import imageService from './image.service';
import infrastructureService from './infrastructure.service';
import regionService from './region.service';

import './index.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructure';

angular
  .module(moduleName, [
    diagram,
    iacDeploy,
    list,
    'ovh-api-services',
    'ngOvhJsplumb',
    'ui.router',
    virtualMachine,
    volume,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.infrastructure', {
        url: '/infrastructure?openVncWithId',
        sticky: true,
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: 'CloudProjectComputeInfrastructureCtrl',
          },
        },
        params: {
          openVncWithId: { value: null },
          // true to indicate that we want to display the add volume popover
          createNewVolume: false,
          // pass snapshot data to display restore volume popover
          createNewVolumeFromSnapshot: { snapshot: null },
          // true to indicate that we want to display the add VM popover
          createNewVm: false,
          editVm: null,
          monitorVm: null,
          hTerm: null,
        },
        translations: {
          value: [
            '../snapshot/add',
            '../volume/snapshot',
            '.',
            './ip/failover/import',
            './ip/failover/buy',
            './volume',
            './volume/addEdit',
            './virtualMachine/addEdit',
            './virtualMachine/delete',
            './virtualMachine/vnc',
            './virtualMachine/rescue',
            './virtualMachine/monthlyConfirm',
            './virtualMachine/monitoring',
            './virtualMachine/loginInformation',
            './privateNetwork',
            './privateNetwork/dialog',
            './privateNetwork/delete',
            '../../delete',
            '../../rename',
            './openstackClient',
            '../../../../vrack/modals',
          ],
          format: 'json',
        },
      });
  })
  // .config(/* @ngInject */(atInternetControllerDecoratorsProvider) => {
  //   atInternetControllerDecoratorsProvider.decorate({
  //     CloudProjectComputeInfrastructureDiagramCtrl: {
  //       initInfra(atInternet, ctrl) {
  //         ctrl.Cloud.Project().v6().query().$promise
  //           .then((projects) => {
  //             atInternet.trackEvent({
  //               event: `CloudProject-${projects.length}`,
  //               page: 'cloud::iaas::pci-project::compute::infrastructure::diagram',
  //             });
  //           });
  //       },
  //     },
  //   });
  // })
  .service('CloudFlavorService', flavorService)
  .service('CloudImageService', imageService)
  .service('CloudProjectComputeInfrastructureService', infrastructureService)
  .service('CloudRegionService', regionService);

export default moduleName;
