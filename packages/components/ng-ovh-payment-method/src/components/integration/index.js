import angular from 'angular';

import component from './component';
import iframeVantiv from './iframeVantiv';
import inContext from './inContext';
import redirect from './redirect';

import directive from './directive';

const moduleName = 'ngOvhPaymentMethodIntegration';

angular
  .module(moduleName, [component, iframeVantiv, inContext, redirect])
  .directive(directive.name, () => directive);

export default moduleName;
