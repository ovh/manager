import angular from 'angular';
import '@uirouter/angularjs';

import activityLog from './activity-log';
import cluster from './cluster';
import credentials from './credentials';
import serviceInformation from './service-information';
import serviceComponent from './service.component';

const moduleName = 'ovhManagerAdpServiceComponent';

angular
  .module(moduleName, [
    'ui.router',
    activityLog,
    cluster,
    credentials,
    serviceInformation,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('adp.service', {
      url: '/:serviceName',
      component: 'serviceComponent',
      translations: {
        value: [
          '.',
        ],
        format: 'json',
      },
    });
  })
  .component('serviceComponent', serviceComponent);

export default moduleName;
