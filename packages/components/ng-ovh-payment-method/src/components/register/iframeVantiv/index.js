import angular from 'angular';

import directive from './directive';

const moduleName = 'ngOvhPaymentMethodRegisterIframeVantiv';

angular
  .module(moduleName, [])
  .directive(directive.name, () => directive);

export default moduleName;
