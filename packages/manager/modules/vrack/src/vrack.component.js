import angular from 'angular';

import controller from './vrack.controller';
import template from './vrack.html';
import vrackService from './vrack.service';

import actionsPartials from './partials/actions.html';
import availablePartials from './partials/available.html';
import mappedPartials from './partials/mapped.html';

import './vrack.less';
import './vrack-mapper.less';

export default angular
  .module('OvhManagerFreefaxComponent', [
    'ui.router',
  ])
  .run(/* @ngInject */ ($templateCache) => {
    $templateCache.put('vrack/partials/actions.html', actionsPartials);
    $templateCache.put('vrack/partials/available.html', availablePartials);
    $templateCache.put('vrack/partials/mapped.html', mappedPartials);
  })
  .service('VrackService', vrackService)
  .component('ovhManagerVrackComponent', {
    template,
    controller,
    controllerAs: 'VrackCtrl',
  })
  .config(($stateProvider) => {
    $stateProvider.state('freefax', {
      url: '/vrack/:vrackId',
      component: 'ovhManagerVrackComponent',
      translations: {
        value: ['../common', '.', './modals'],
        format: 'json',
      },
    });
  /*
  $stateProvider
    .state('vrack-home', {
      url: '/vrack',
      templateUrl: 'app/vrack/vrack.html',
      controller: 'VrackCtrl',
      controllerAs: 'VrackCtrl',
      translations: {
        value: ['../common', '.'],
        format: 'json',
      },
    });
    */
  });
