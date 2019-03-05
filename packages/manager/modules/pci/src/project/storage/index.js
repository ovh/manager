import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-ui-angular';

import add from './add';
import details from './details';
import services from './services';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectStorage';

angular
  .module(moduleName, [
    add,
    details,
    'ui.router',
    'oc.lazyLoad',
    'oui',
    'ovhManagerCore',
    services,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.storage', {
        url: '/storage',
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: 'RA.storageCtrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  });

export default moduleName;
