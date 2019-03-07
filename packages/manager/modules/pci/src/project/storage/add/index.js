import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-ui-angular';

import controller from './controller';
import template from './template.html';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectStorageAdd';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'oui',
    'ovhManagerCore',
  ])
  .config(/* @ngInject */($stateProvider) => {

    $stateProvider
      .state('iaas.pci-project.compute.storage.add-container', {
        url: '/add',
        views: {
          'cloudProjectCompute@iaas.pci-project.compute': {
            template,
            controller,
            controllerAs: 'RA.storageAddCtrl',
          },
        },
        translations: {
          value: [
            '..',
            '.',
          ],
          format: 'json',
        },
      });
  });

export default moduleName;
