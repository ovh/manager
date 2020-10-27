import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceVoicemailPassword from '../../../service/voicemail/password';

import routing from './password.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxVoicemailPassword';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceVoicemailPassword,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./../translations */);

export default moduleName;
