import {
  name as serviceName,
  OvhManagerPccServicePackOptionService,
} from './option.service';

const moduleName = 'dedicatedCloudServicePackOption';

angular
  .module(moduleName, [
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, OvhManagerPccServicePackOptionService);

export default moduleName;
