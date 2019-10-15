import option from './option';

import {
  name as serviceName,
  ServicePackService,
} from './service-pack.service';

const moduleName = 'ovhManagerPccServicePack';

angular
  .module(moduleName, [
    option,
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, ServicePackService);

export default moduleName;
