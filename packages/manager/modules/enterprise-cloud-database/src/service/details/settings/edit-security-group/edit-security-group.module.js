import angular from 'angular';

import editSecurityGroupComponent from './edit-security-group.component';
import routing from './edit-security-group.routing';
import securityGroupNameComponent from '../../../security-group-name';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsSettingsEditSecurityGroup';

angular
  .module(moduleName, [
    securityGroupNameComponent,
  ])
  .component('enterpriseCloudDatabaseServiceDetailsSettingsEditSecurityGroupComponent', editSecurityGroupComponent)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
