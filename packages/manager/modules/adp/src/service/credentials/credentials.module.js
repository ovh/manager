import angular from 'angular';
import '@uirouter/angularjs';

import credentialsComponent from './credentials.component';

const moduleName = 'ovhManagerAdpCredentialsComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('adp.service.credentials', {
      url: '/credentials',
      component: 'credentialsComponent',
      translations: {
        value: [
          '.',
        ],
        format: 'json',
      },
    });
  })
  .component('credentialsComponent', credentialsComponent);

export default moduleName;
