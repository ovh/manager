import angular from 'angular';
import '@uirouter/angularjs';
import routing from './delete-device.routing';
import component from './delete-device.component';

const moduleName = 'ovhManagerTelecomTelephonyLineSoftphoneSendLink';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('softphoneDeleteDevice', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
