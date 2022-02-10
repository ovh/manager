import angular from 'angular';

import component from './edit-name.component';
import routing from './edit-name.routing';

import inputRule from '../components/input-rule';

const moduleName = 'ovhManagerPciStoragesDatabaseName';

angular
  .module(moduleName, [inputRule])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
