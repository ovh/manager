import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import dialplan from './dialplan';
import menu from './menu';
import sound from './sound';
import tts from './tts';

import component from './ovh-pabx.component';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupNumberFeatureOvhPabx';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    dialplan,
    menu,
    sound,
    tts,
  ])
  .component('telephonyNumberOvhPabx', component)
  .run(/* @ngTranslationsInject:json ./translations ./types/cloudHunting/translations ./types/cloudlvr/translations ./types/contactCenterSolutionExpert/translations */);

export default moduleName;
