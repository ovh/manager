import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-api-wrappers';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingSnapshotList';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .component('snapshotList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
