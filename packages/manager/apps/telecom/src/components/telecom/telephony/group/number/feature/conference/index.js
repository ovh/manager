import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import configurationTemplate from './conference-configuration.html';
import participantActionsTemplate from './partiticipant/participant-actions.html';

import component from './conference.component';
import service from './conference-polling.service';

import './conference.less';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupNumberConference';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('telephonyNumberConference', component)
  .service('telephonyGroupNumberConferencePolling', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'components/telecom/telephony/group/number/feature/conference/conference-configuration.html',
        configurationTemplate,
      );
      $templateCache.put(
        'components/telecom/telephony/group/number/feature/conference/partiticipant/participant-actions.html',
        participantActionsTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
