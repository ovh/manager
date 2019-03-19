import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectPrices';

angular
  .module(moduleName, [
    'ovh-api-services',
  ])
  .service('OvhCloudPriceHelper', service);

export default moduleName;
