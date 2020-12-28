import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceFaxCustomDomains from '../../../service/fax/customDomains';

import routing from './custom-domains.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxFaxCustomDomains';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceFaxCustomDomains,
  ])
  .config(routing);

export default moduleName;
