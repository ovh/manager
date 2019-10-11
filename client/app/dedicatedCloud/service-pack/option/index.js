import {
  name as serviceName,
  ServicePackOptionService,
} from './option.service';

const moduleName = 'ovhManagerPccServicePackOption';

angular
  .module(moduleName, [])
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, ServicePackOptionService);

export default moduleName;
