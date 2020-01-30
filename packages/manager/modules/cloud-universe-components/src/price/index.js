import angular from 'angular';
import 'ovh-api-services';

import service from './service';

const moduleName = 'cucPrice';

angular
  .module(moduleName, ['ovh-api-services'])
  .service('CucPriceHelper', service);

export default moduleName;
