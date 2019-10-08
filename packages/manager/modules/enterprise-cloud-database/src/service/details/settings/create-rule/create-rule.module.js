import angular from 'angular';

import createRuleComponent from './create-rule.component';
import routing from './create-rule.routing';
import ruleComponent from '../../../rule';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsSettingsCreateRule';

angular
  .module(moduleName, [
    ruleComponent,
  ])
  .component('enterpriseCloudDatabaseServiceDetailsSettingsCreateRuleComponent', createRuleComponent)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
