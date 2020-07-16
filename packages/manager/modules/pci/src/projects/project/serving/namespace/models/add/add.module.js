import angular from 'angular';
import '@ovh-ux/ng-at-internet';

import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';
import routing from './add.routing';
import component from './add.component';
import service from '../service/models.module';
import capabilities from '../../../capabilities.service';

import ovhManagerPciStoragesContainers from '../../../../storages/containers';

const moduleName = 'ovhManagerPciProjectServingNamespaceModelsAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ngAtInternet',
    service,
    ovhManagerPciStoragesContainers,
    ovhManagerCatalogPrice,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectServingNamespaceModelsAddComponent',
    component,
  )
  .service(
    'OvhManagerPciServingNamespaceModelsAddServiceCapabilities',
    capabilities,
  );

export default moduleName;
