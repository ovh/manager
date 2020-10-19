import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-feature-flipping';
import '@ovh-ux/manager-core';

import utils from '../utils';
import component from './subscription-tile.component';

const moduleName = 'ovhManagerBillingSubscriptionTile';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngOvhFeatureFlipping',
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    utils,
  ])
  .component('billingSubscriptionTile', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
