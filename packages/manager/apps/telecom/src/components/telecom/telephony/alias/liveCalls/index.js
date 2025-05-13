import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './live-calls.component';

import eavesdropTemplate from './eavesdrop/eavesdrop.html';
import eavesdropController from './eavesdrop/eavesdrop.controller';

import hangupTemplate from './hangup/hangup.html';
import hangupController from './hangup/hangup.controller';

import interceptTemplate from './intercept/intercept.html';
import interceptController from './intercept/intercept.controller';

import transferTemplate from './transfer/transfer.html';
import transferController from './transfer/transfer.controller';

const moduleName = 'ovhManagerTelecomComponentsTelecomTelephonyAliasLiveCalls';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('telecomTelephonyAliasLiveCalls', component)
  .controller(
    'TelecomTelephonyAliasConfigurationLiveCallsEavesdropCtrl',
    eavesdropController,
  )
  .controller(
    'TelecomTelephonyAliasConfigurationLiveCallsHangupCtrl',
    hangupController,
  )
  .controller(
    'TelecomTelephonyAliasConfigurationLiveCallsInterceptCtrl',
    interceptController,
  )
  .controller(
    'TelecomTelephonyAliasConfigurationLiveCallsTransferCtrl',
    transferController,
  )
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'components/telecom/telephony/alias/liveCalls/eavesdrop/eavesdrop.html',
        eavesdropTemplate,
      );
      $templateCache.put(
        'components/telecom/telephony/alias/liveCalls/hangup/hangup.html',
        hangupTemplate,
      );
      $templateCache.put(
        'components/telecom/telephony/alias/liveCalls/intercept/intercept.html',
        interceptTemplate,
      );
      $templateCache.put(
        'components/telecom/telephony/alias/liveCalls/transfer/transfer.html',
        transferTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
