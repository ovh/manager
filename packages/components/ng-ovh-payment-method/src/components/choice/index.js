import angular from 'angular';
import component from './component';

const moduleName = 'ngOvhPaymentMethodChoice';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
