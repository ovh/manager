import angular from 'angular';
import '@ovh-ux/ng-ovh-contracts';

import controller from './vrack.controller';
import template from './vrack.html';
import vrackService from './vrack.service';

import actionsPartials from './partials/actions.html';
import availablePartials from './partials/available.html';
import mappedPartials from './partials/mapped.html';

import './vrack.less';
import './vrack-mapper.less';

const moduleName = 'OvhManagerVrackComponent';

angular
  .module(moduleName, [
    'ui.router',
    'ngOvhContracts',
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
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('vrack', {
      url: '/vrack/:vrackId',
      component: 'ovhManagerVrackComponent',
      translations: {
        value: ['.', './modals'],
        format: 'json',
      },
    });
  });

export default moduleName;
