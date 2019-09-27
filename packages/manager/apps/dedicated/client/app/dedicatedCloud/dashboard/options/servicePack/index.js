import {
  name as serviceName,
  OvhManagerPccServicePackService,
} from './servicePack.service';
import option from './option';

const moduleName = 'ovhManagerPccServicePacks';

angular
  .module(moduleName, [
    option,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, OvhManagerPccServicePackService);

export default moduleName;
