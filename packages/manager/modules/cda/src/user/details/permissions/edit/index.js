import angular from 'angular';

import routing from './cda-user-details-permission-list-edit';

import './cda-user-details-permission-list-edit.less';

const moduleName = 'ovhManagerCdaUserPermissionEdit';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
