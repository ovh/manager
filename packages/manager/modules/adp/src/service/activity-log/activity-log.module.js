import angular from 'angular';
import '@uirouter/angularjs';

import activityLogComponent from './activity-log.component';

const moduleName = 'ovhManagerAdpActivityLogComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('adp.service.log', {
      url: '/log',
      component: 'activityLogComponent',
      translations: {
        value: [
          '.',
        ],
        format: 'json',
      },
    });
  })
  .component('activityLogComponent', activityLogComponent);

export default moduleName;
