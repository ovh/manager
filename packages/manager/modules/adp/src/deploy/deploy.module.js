import angular from 'angular';
import '@uirouter/angularjs';
import deployComponent from './deploy.component';

const moduleName = 'ovhManagerAdpDeployComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('adp.deploy', {
      url: '/deploy',
      component: 'deployComponent',
      translations: {
        value: [
          '.',
          './..',
        ],
        format: 'json',
      },
    });
  })
  .component('deployComponent', deployComponent);

export default moduleName;
