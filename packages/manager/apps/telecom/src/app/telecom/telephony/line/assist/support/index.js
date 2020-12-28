import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceAssistSupport from '../../../service/assist/support';

import routing from './support.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineAssistSupport';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceAssistSupport,
  ])
  .config(routing);

export default moduleName;
