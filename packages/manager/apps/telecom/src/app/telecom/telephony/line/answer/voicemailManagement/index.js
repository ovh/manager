import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceVoicemailManagement from '../../../service/voicemail/management';

import routing from './voicemail-management.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineAnswerVoicemailManagement';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    serviceVoicemailManagement,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./../translations */);

export default moduleName;
