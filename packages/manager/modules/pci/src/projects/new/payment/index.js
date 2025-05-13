import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-payment-method';
import 'ovh-api-services';

import components from './components';
import credit from './credit';

import routing from './routing';
import component from './component';
import paymentService from './service';

const moduleName = 'pciProjectNewPayment';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
    'ovh-api-services',
    components,
    credit,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component)
  .service('pciProjectNewPayment', paymentService);

export default moduleName;
