import angular from 'angular';
import '@uirouter/angularjs';
import userAdd from './user-add';
import routing from './add.routing';

const moduleName = 'ovhManagerObjectStorageUsersAdd';
angular
  .module(moduleName, [userAdd, 'ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
