import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceFaxSettings from '../../../service/fax/settings';

import routing from './settings.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineFaxSettings';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceFaxSettings,
  ])
  .config(routing);

export default moduleName;
