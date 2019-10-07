import angular from 'angular';
import ruleComponent from './rule.component';

const moduleName = 'enterpriseCloudDatabaseServiceRule';

angular
  .module(moduleName, [])
  .component('enterpriseCloudDatabaseServiceRuleComponent', ruleComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
