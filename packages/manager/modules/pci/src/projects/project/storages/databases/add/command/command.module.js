import angular from 'angular';

import component from './command.component';
import routing from './command.routing';
import orderReview from '../../components/order-review';

const moduleName = 'ovhManagerPciStoragesDatabasesAddCommand';

angular
  .module(moduleName, [orderReview])
  .config(routing)
  .component('ovhManagerPciProjectDatabasesAddCommand', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
