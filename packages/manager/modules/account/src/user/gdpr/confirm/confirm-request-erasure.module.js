import routing from './confirm-request-erasure.routing';
import component from './confirm-request-erasure.component';

const moduleName = 'ovhManagerAccountGdprConfirmModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('gdprFeaturesConfirm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
