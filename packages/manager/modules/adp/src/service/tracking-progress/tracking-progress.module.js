import angular from 'angular';
import '@uirouter/angularjs';

import progressComponent from './tracking-progress.component';

const moduleName = 'ovhManagerAdpProgressComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('adp.service.progress', {
      url: '/progress',
      component: 'progressComponent',
      translations: {
        value: [
          '.',
        ],
        format: 'json',
      },
    });
  })
  .component('progressComponent', progressComponent);

export default moduleName;
