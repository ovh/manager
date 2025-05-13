import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceFaxFiltering from '../../../service/fax/filtering';

import routing from './filtering.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineFaxFiltering';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceFaxFiltering,
  ])
  .config(routing);

export default moduleName;
