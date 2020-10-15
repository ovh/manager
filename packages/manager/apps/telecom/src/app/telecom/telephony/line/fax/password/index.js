import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceFaxPassword from '../../../service/fax/password';

import routing from './password.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineFaxPassword';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceFaxPassword,
  ])
  .config(routing);

export default moduleName;
