import angular from 'angular';
import '@uirouter/angularjs';
import routing from './delete-all-device.routing';
import component from './delete-all-device.component';

const moduleName = 'ovhManagerTelecomTelephonyLineSoftphoneDeleteAllDevice';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('softphoneDeleteAllDevice', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
