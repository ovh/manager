import angular from 'angular';
import routing from './telecom-sms-options-blacklist.routing';
import telecomSmsOptionsBlacklist from './telecom-sms-options-blacklist.component';

const moduleName = 'ovhManagerSmsOptionsBlacklist';

angular
  .module(moduleName, [])
  .component('telecomSmsOptionsBlacklist', telecomSmsOptionsBlacklist)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
