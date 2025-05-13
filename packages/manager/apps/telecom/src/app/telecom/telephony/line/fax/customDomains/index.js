import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceFaxCustomDomains from '../../../service/fax/customDomains';

import routing from './custom-domains.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineFaxCustomDomains';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceFaxCustomDomains,
  ])
  .config(routing);

export default moduleName;
