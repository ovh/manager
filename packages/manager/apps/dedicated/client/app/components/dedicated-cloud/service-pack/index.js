import option from './option';
import servicePackService from './service-pack.service';

const moduleName = 'ovhManagerPccServicePack';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    option,
    servicePackService,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
