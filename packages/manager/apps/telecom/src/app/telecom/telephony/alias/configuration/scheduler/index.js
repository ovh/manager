import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import oldPabx from './oldPabx';
import ovhPabx from './ovhPabx';

const moduleName = 'ovhManagerTelecomTelephonyAliasConfigurationScheduler';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    oldPabx,
    ovhPabx,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
