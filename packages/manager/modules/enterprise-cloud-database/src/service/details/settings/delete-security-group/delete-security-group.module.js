import angular from 'angular';

import deleteSecurityGroupComponent from './delete-security-group.component';
import routing from './delete-security-group.routing';

const moduleName =
  'enterpriseCloudDatabaseServiceDetailsSettingsDeleteSecurityGroup';

angular
  .module(moduleName, [])
  .component(
    'enterpriseCloudDatabaseServiceDetailsSettingsDeleteSecurityGroupComponent',
    deleteSecurityGroupComponent,
  )
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
