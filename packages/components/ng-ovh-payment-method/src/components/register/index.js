import angular from 'angular';
import iframeVantiv from './iframeVantiv';

import component from './component';

const moduleName = 'ngOvhPaymentMethodRegister';

angular
  .module(moduleName, [
    iframeVantiv,
  ])
  .component(component.name, component);

export default moduleName;
