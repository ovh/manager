import angular from 'angular';
import '@uirouter/angularjs';

import roles from './roles';
import userAdd from './user-add';
import routing from './add.routing';

const moduleName = 'ovhManagerPciUsersAdd';

angular
  .module(moduleName, [roles, userAdd, 'ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
