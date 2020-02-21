import angular from 'angular';
import '@uirouter/angularjs';

import SparkConfigComponent from './spark-config.component';
import PciStoragesContainersService from '../../../storages/containers/containers.service';
import SparkConfigService from './spark-config.service';

const moduleName = 'ovhManagerDataProcessingSubmitJobSparkConfig';

angular
  .module(moduleName, ['ui.router'])
  .component('dataprocessingSubmitJobSparkConfig', SparkConfigComponent)
  .service('PciStoragesContainersService', PciStoragesContainersService)
  .service('SparkConfigService', SparkConfigService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
