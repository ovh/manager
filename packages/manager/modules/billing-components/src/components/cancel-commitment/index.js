import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './cancel-commitment.component';

const moduleName = 'ovhManagerBillingCaommitmentCancel';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'oui', ovhManagerCore])
  .component('billingCancelCommitment', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
