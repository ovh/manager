import angular from 'angular';

import createSecurityGroupComponent from './create-security-group.component';
import routing from './create-security-group.routing';
import securityGroupNameComponent from '../../../security-group-name';

const moduleName =
  'enterpriseCloudDatabaseServiceDetailsSettingsCreateSecurityGroup';

angular
  .module(moduleName, [securityGroupNameComponent])
  .component(
    'enterpriseCloudDatabaseServiceDetailsSettingsCreateSecurityGroupComponent',
    createSecurityGroupComponent,
  )
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
