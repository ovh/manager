import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/manager-filters';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './flavors-list.component';
import service from './flavors-list.service';
import './flavor-group.scss';

const moduleName = 'ovhManagerPciFlavorsList';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovhManagerFilters',
  ])
  .component('pciProjectFlavorsList', component)
  .service('PciProjectFlavors', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
