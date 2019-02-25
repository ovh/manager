import angular from 'angular';
import '@uirouter/angularjs';

import template from './vrack-add.html';
import controller from './vrack-add.controller';

import './vrack-add.less';

const moduleName = 'ovhManagerVrackAddComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(($stateProvider) => {
    $stateProvider.state('vrack.add', {
      url: '/vrack/new',
      template,
      controller,
      controllerAs: 'VrackAddCtrl',
      translations: {
        value: ['../../common', '..', '.'],
        format: 'json',
      },
    });
  });

export default moduleName;
