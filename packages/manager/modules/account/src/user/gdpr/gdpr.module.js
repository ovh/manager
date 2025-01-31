import component from './gdpr.component';
import routing from './gdpr.routing';
import service from './gdpr.service';

const moduleName = 'ovhManagerAccountGdprModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('gdprFeatures', component)
  .service('gdprService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
