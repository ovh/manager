import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';

import routing from './routing';

const moduleName = 'ovhBillingPaymentMethodSplitPaymentActivate';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    'ui.router',
  ])
  .config(routing);

export default moduleName;
