import angular from 'angular';
import '@uirouter/angularjs';

import users from './users';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectOpenstack';

angular
  .module(moduleName, [
    users,
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.openstack', {
        url: '/openstack',
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: 'CloudProjectOpenstackCtrl',
          },
        },
        redirectTo: 'iaas.pci-project.compute.openstack.users',
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  });

export default moduleName;
