import angular from 'angular';

import component from './edit-name.component';
import routing from './edit-name.routing';
import inputRule from '../../../components/input-rule';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformationName';

angular
  .module(moduleName, [inputRule])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseGeneralInformationName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
