import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceVoicemailDefault from '../../../service/voicemail/default';

import routing from './default-voicemail.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineAnswerDefaultVoicemail';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    serviceVoicemailDefault,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./../translations ./../../../service/voicemail/default/translations */);

export default moduleName;
