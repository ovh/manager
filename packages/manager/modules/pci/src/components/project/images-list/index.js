import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './images-list.component';
import service from './images-list.service';

const moduleName = 'PciProjectImagesList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectImagesList', component)
  .service('PciProjectImages', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
