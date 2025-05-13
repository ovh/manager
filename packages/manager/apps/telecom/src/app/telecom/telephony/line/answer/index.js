import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import defaultVoicemail from './defaultVoicemail';
import voicemailManagement from './voicemailManagement';
import voicemailOptions from './voicemailOptions';
import voicemailPassword from './voicemailPassword';

import routing from './answer.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineAnswer';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    defaultVoicemail,
    voicemailManagement,
    voicemailOptions,
    voicemailPassword,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
