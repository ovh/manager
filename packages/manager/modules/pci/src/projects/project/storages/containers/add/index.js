import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';
import 'angular-ui-bootstrap';

import regionsList from '../../blocks/add/regions-list';
import component from './add.component';

const moduleName = 'ovhManagerPciStoragesContainersAdd';

angular
  .module(moduleName, [
    regionsList,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
  ])
  .component('pciProjectStorageContainersAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
