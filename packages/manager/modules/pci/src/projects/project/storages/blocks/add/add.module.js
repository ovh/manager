import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './add.component';
import routing from './add.routing';

import regionsList from '../../../../../components/project/regions-list';

const moduleName = 'ovhManagerPciStoragesBlocksAdd';

angular
  .module(moduleName, [
    regionsList,
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectStorageBlocksAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
