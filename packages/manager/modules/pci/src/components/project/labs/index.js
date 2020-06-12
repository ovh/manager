import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './labs.component';
import service from './labs.service';

const moduleName = 'ovhManagerPciProjectLab';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectLabAgreements', component)
  .service('PciProjectLabsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
