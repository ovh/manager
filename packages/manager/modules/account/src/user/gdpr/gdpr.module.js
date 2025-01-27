import component from './gdpr.component';
import routing from './gdpr.routing';

const moduleName = 'ovhManagerAccountGdprModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('gdprFeatures', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
