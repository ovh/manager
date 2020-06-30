import angular from 'angular';
import '@ovh-ux/ng-at-internet';

import routing from './details.routing';
import component from './details.component';
import service from '../service/models.module';
import capabilities from '../../../capabilities.service';

import ovhManagerPciStoragesContainers from '../../../../storages/containers';
import metricsChartComponent from './metrics-chart';

const moduleName = 'ovhManagerPciProjectServingNamespaceModelsDetails';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ngAtInternet',
    metricsChartComponent,
    service,
    ovhManagerPciStoragesContainers,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectServingNamespaceModelsDetailsComponent',
    component,
  )
  .service(
    'OvhManagerPciServingNamespaceModelsDetailsServiceCapabilities',
    capabilities,
  );

export default moduleName;
