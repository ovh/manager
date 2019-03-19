import angular from 'angular';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ng-ovh-toaster';
import '@ovh-ux/ng-ovh-api-wrappers';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import factory from './factory';
import service from './service';
import volumeFactory from './volume/factory';

const moduleName = 'ovhManagerPciComponentsProjectComputeVolumes';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'ngOvhToaster',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .factory('CloudProjectComputeVolumesFactory', factory)
  .factory('CloudProjectComputeVolumesVolumeFactory', volumeFactory)
  .service('CloudProjectComputeVolumesOrchestrator', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
