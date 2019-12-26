import angular from 'angular';

import deleteRuleComponent from './delete-rule.component';
import routing from './delete-rule.route';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsSettingsDeleteRule';

angular
  .module(moduleName, [])
  .component(
    'enterpriseCloudDatabaseServiceDetailsSettingsDeleteRuleComponent',
    deleteRuleComponent,
  )
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
