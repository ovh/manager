import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import campaigns from './campaigns';
import convertToVoicefax from './convertToVoicefax';
import customDomains from './customDomains';
import filtering from './filtering';
import password from './password';
import settings from './settings';

import routing from './fax.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineFax';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    campaigns,
    convertToVoicefax,
    customDomains,
    filtering,
    password,
    settings,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
