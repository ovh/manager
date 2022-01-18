import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-filters';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './iplb.routing';

const moduleName = 'ovhManagerIpLoadBalancer';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    'ovhManagerFilters',
    ListLayoutHelper.moduleName,
  ])
  .config(routing);

export default moduleName;
