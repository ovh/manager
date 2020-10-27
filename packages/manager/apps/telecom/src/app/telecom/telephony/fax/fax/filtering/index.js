import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceFaxFiltering from '../../../service/fax/filtering';

import routing from './filtering.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxFaxFiltering';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceFaxFiltering,
  ])
  .config(routing);

export default moduleName;
