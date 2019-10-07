import angular from 'angular';

import details from './details';
import getStarted from './get-started';
import enterpriseCloudDatabaseServiceComponent from './service.component';
import routing from './service.routing';
import password from './password';

const moduleName = 'enterpriseCloudDatabaseService';

angular
  .module(moduleName, [
    details,
    getStarted,
    password,
  ])
  .config(routing)
  .component('enterpriseCloudDatabaseServiceComponent', enterpriseCloudDatabaseServiceComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
