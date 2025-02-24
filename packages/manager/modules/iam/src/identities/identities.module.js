import angular from 'angular';
import users from './users/users.module';
import userGroups from './user-groups';
import sso from './sso';

import component from './identities.component';
import routing from './identities.routing';

const moduleName = 'ovhManagerIAMIdentities';

angular
  .module(moduleName, [users, userGroups, sso])
  .component('iamIdentities', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
