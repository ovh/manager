import component from './edit.component';
import routing from './edit.routing';

const moduleName = 'ovhManagerDedicatedAccountContactsServiceEdit';

angular
  .module(moduleName, [])
  .config(routing)
  .component('accountContactsServiceEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
