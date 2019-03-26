import angular from 'angular';
import '@uirouter/angularjs';

import serviceInformationComponent from './service-information.component';

const moduleName = 'ovhManagerAdpServiceInformationComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('adp.service.details', {
      url: '/details',
      component: 'serviceInformationComponent',
      translations: {
        value: [
          '.',
        ],
        format: 'json',
      },
    });
  })
  .component('serviceInformationComponent', serviceInformationComponent);

export default moduleName;
