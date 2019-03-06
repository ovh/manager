import angular from 'angular';
import '@uirouter/angularjs';

import controller from './controller';
import template from './template.html';

import openrcController from './openrc/controller';
import openrcTemplate from './openrc/template.html';

import passwordService from './password/service';
import rcloneService from './rclone/service';
import tokenService from './token/service';

const moduleName = 'ovhManagerPciProjectOpenstackUsers';

angular
  .module(moduleName, [])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.openstack.users', {
        url: '/users',
        sticky: true,
        views: {
          cloudProjectOpenstack: {
            template,
            controller,
            controllerAs: 'CloudProjectOpenstackUsersCtrl',
          },
        },
        translations: {
          value: [
            '.',
            './token',
            './openrc',
            './rclone',
          ],
          format: 'json',
        },
      });

    $stateProvider
      .state('iaas.pci-project.compute.openstack.users.openrc', {
        url: '/openrc',
        template: openrcTemplate,
        controller: openrcController,
        controllerAs: 'OpenstackUsersOpenrcCtrl',
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  })
  .service('OpenstackUsersToken', tokenService)
  .service('CloudProjectOpenstackUsersRcloneService', rcloneService)
  .service('OpenstackUsersPassword', passwordService);

export default moduleName;
