import angular from 'angular';
import '@uirouter/angularjs';
import component from './telecom-sms-configure-time2chat.component';
import routing from './telecom-sms-configure-time2chat.routing';

const moduleName = 'ovhManagerSmsSendersConfigureTime2Chat';

angular
  .module(moduleName, ['ui.router'])
  .component('smsSendersConfigureTime2Chat', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
