import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceVoicemailOptions from '../../../service/voicemail/options';

import routing from './voicemail-options.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineAnswerVoicemailOptions';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    serviceVoicemailOptions,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./../translations */);

export default moduleName;
