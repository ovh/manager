import angular from 'angular';
import '@uirouter/angularjs';

import template from './deploy.html';
import controller from './deploy.controller';

const moduleName = 'ovhManagerAdpDeployComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(($stateProvider) => {
    $stateProvider.state('adp.deploy', {
      url: '/deploy',
      component: 'ovhManagerAdpDeployComponent',
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  })
  .component('ovhManagerAdpDeployComponent', {
    template,
    controller,
  });

export default moduleName;
