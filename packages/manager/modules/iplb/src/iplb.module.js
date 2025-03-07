import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-filters';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

const moduleName = 'ovhManagerIpLoadBalancer';

angular.module(moduleName, [
  ngOvhFeatureFlipping,
  ngTranslateAsyncLoader,
  'oui',
  'pascalprecht.translate',
  'ovhManagerFilters',
  ListLayoutHelper.moduleName,
]);

export default moduleName;
