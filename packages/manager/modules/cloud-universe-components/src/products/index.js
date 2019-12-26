import angular from 'angular';
import 'ovh-api-services';

import service from './service';

const moduleName = 'cucProducts';

angular
  .module(moduleName, ['ovh-api-services'])
  .service('CucProductsService', service);

export default moduleName;
