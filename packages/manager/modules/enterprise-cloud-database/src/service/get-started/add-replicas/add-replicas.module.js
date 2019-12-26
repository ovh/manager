import angular from 'angular';
import '@uirouter/angularjs';

import addComponent from '../../add-replicas';
import routing from './add-replicas.routing';

const moduleName = 'enterpriseCloudDatabaseServiceGetStartedAddReplicas';

angular
  .module(moduleName, ['ui.router', addComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
