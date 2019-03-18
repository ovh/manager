import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import factory from './factory';
import service from './service';
import volumeFactory from './volume/factory';

const moduleName = 'ovhManagerPciComponentsProjectComputeVolumes';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .factory('CloudProjectComputeVolumesFactory', factory)
  .factory('CloudProjectComputeVolumesVolumeFactory', volumeFactory)
  .service('CloudProjectComputeVolumesOrchestrator', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
