import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceAssistLogs from '../../../service/assist/logs';

import routing from './logs.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineAssistLogs';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceAssistLogs,
  ])
  .config(routing);

export default moduleName;
