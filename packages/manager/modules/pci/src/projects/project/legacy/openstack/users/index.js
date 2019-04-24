import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import controller from './controller';
import template from './template.html';

import openrcController from './openrc/controller';
import openrcTemplate from './openrc/template.html';

import passwordService from './password/service';
import rcloneService from './rclone/service';
import tokenService from './token/service';

const moduleName = 'ovhManagerPciProjectOpenstackUsers';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.legacy.compute.openstack.users', {
        url: '/users',
        sticky: true,
        views: {
          cloudProjectOpenstack: {
            template,
            controller,
            controllerAs: 'CloudProjectOpenstackUsersCtrl',
          },
        },
        resolve: {
          breadcrumb: $translate => $translate
            .refresh()
            .then(() => $translate.instant('openstackusers')),
        },
      });

    $stateProvider
      .state('pci.projects.project.legacy.compute.openstack.users.openrc', {
        url: '/openrc',
        template: openrcTemplate,
        controller: openrcController,
        controllerAs: 'OpenstackUsersOpenrcCtrl',
      });
  })
  .service('OpenstackUsersToken', tokenService)
  .service('CloudProjectOpenstackUsersRcloneService', rcloneService)
  .service('OpenstackUsersPassword', passwordService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
