import angular from 'angular';
import '@uirouter/angularjs';
import routing from './send-link.routing';
import component from './send-link.component';

const moduleName = 'ovhManagerTelecomTelephonyLineSoftphoneSendLink';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('softphoneSendLinkByMail', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
