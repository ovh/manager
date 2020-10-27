import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceVoicemailPassword from '../../../service/voicemail/password';

import routing from './voicemail-password.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineAnswerVoicemailPassword';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    serviceVoicemailPassword,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./../translations */);

export default moduleName;
