import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceFaxSettings from '../../../service/fax/settings';

import routing from './settings.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxFaxSettings';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceFaxSettings,
  ])
  .config(routing);

export default moduleName;
