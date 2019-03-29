import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ng-ovh-jsplumb';

import diagram from './diagram';
import iac from './iac';
import ip from './ip';
import openstackClient from './openstackClient';
import popover from './popover';
import privateNetwork from './privateNetwork';
import virtualMachine from './virtualMachine';
import volume from './volume';

import controller from './controller';
import template from './template.html';

import imageService from './image.service';
import infrastructureService from './infrastructure.service';
import regionService from './region.service';

import './index.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructure';

angular
  .module(moduleName, [
    diagram,
    iac,
    ip,
    'ngTranslateAsyncLoader',
    openstackClient,
    'ovh-api-services',
    'pascalprecht.translate',
    popover,
    privateNetwork,
    'ngOvhJsplumb',
    'ui.router',
    virtualMachine,
    volume,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.legacy.compute.infrastructure', {
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
  //               page: 'cloud::iaas::project::compute::infrastructure::diagram',
  //             });
  //           });
  //       },
  //     },
  //   });
  // })
  .service('CloudImageService', imageService)
  .service('CloudProjectComputeInfrastructureService', infrastructureService)
  .service('CloudRegionService', regionService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
