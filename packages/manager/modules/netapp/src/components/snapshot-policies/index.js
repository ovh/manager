import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerNetappSnapshotPoliciesComponent';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('snapshotPolicies', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
