import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './flavors-list.component';
import service from './flavors-list.service';

const moduleName = 'ovhManagerPciFlavorsList';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectFlavorsList', component)
  .service('PciProjectFlavors', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
