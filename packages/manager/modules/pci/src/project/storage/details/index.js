import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-ui-angular';

import services from '../services';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectStorageDetails';

angular
  .module(moduleName, [
    'oc.lazyLoad',
    'oui',
    'ovhManagerCore',
    services,
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.storage.detail-container', {
        url: '/{storageId}',
        views: {
          'cloudProjectCompute@iaas.pci-project.compute': {
            template,
            controller,
            controllerAs: 'RA.storageDetailsCtrl',
          },
        },
        translations: {
          value: [
            '.',
            './storage-details',
          ],
          format: 'json',
        },
      });
  });

export default moduleName;
