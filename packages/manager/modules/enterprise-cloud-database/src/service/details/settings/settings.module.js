import angular from 'angular';

import createRule from './create-rule';
import createSecurityGroup from './create-security-group';
import deleteRule from './delete-rule';
import deleteSecurityGroup from './delete-security-group';
import editSecurityGroup from './edit-security-group';
import enterpriseCloudDatabaseServiceDetailsSettingsComponent from './settings.component';
import maintenanceWindow from '../../maintenance-window';
import routing from './settings.routing';

import './settings.less';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsSettings';

angular
  .module(moduleName, [
    createRule,
    createSecurityGroup,
    deleteRule,
    deleteSecurityGroup,
    editSecurityGroup,
    maintenanceWindow,
  ])
  .config(routing)
  .component('enterpriseCloudDatabaseServiceDetailsSettingsComponent', enterpriseCloudDatabaseServiceDetailsSettingsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
