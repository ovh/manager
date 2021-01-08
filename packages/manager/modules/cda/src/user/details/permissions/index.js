import angular from 'angular';

import routing from './cda-user-details-permission-list';
import service from './cda-user-permission.service';
import userPermissionsEdit from './edit';

const moduleName = 'ovhManagerCdaUserPermission';

angular
  .module(moduleName, [userPermissionsEdit])
  .config(routing)
  .service('CdaUserPermissionService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
