import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import assist from './assist';
import consumption from './consumption';
import contact from './contact';
// eslint-disable-next-line import/extensions
import fax from './fax/index';
import management from './management';
import voicemail from './voicemail';

import routing from './fax.routing';

const moduleName = 'ovhManagerTelecomTelephonyFax';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    assist,
    consumption,
    contact,
    fax,
    management,
    voicemail,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ./management/translations */);

export default moduleName;
