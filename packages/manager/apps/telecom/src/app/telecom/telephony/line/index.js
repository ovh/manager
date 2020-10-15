import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import answer from './answer';
import assist from './assist';
import calls from './calls';
import consumption from './consumption';
import contact from './contact';
import fax from './fax';
import management from './management';
import phone from './phone';
import tones from './tones';

import routing from './line.routing';

const moduleName = 'ovhManagerTelecomTelephonyLine';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    answer,
    assist,
    calls,
    consumption,
    contact,
    fax,
    management,
    phone,
    tones,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ./details/translations */);

export default moduleName;
