import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingResourceUsage';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
