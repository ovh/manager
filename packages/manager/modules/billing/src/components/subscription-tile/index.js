import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-feature-flipping';
import '@ovh-ux/manager-core';

import component from './subscription-tile.component';
import service from './subscription-tile.service';

const moduleName = 'ovhManagerBillingSubscriptionTile';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngOvhFeatureFlipping',
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
  ])
  .component('billingSubscriptionTile', component)
  .service('BillingSubscriptionService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
