import angular from 'angular';
import '@uirouter/angularjs';
import routing from './add-device.routing';
import component from './add-device.component';

const moduleName = 'ovhManagerTelecomTelephonyLineSoftphoneAddDevice';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('softphoneAddDevice', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
