import angular from 'angular';

import routing from './cda-user-details';
import cdaUserPermissions from './permissions';

import './cda-user-details.less';

const moduleName = 'ovhManagerCdaUserDetails';

angular
  .module(moduleName, [cdaUserPermissions])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
