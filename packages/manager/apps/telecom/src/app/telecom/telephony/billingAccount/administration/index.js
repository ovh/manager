import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import addGroup from './addGroup';
import deleteGroup from './deleteGroup';
import linesGroup from './linesGroup';
import optionsGroup from './optionsGroup';

import routing from './administration.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountAdministration';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    addGroup,
    deleteGroup,
    linesGroup,
    optionsGroup,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations ./../billing/translations */);

export default moduleName;
