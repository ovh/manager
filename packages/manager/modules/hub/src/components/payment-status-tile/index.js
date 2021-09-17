import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-feature-flipping';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

import paymentStatusTile from './payment-status-tile.component';
import hubTile from '../tile';
import ovhManagerHubTileError from '../tile-error';
import ovhManagerProducts from '../products';

import './payment-status-tile.scss';

const moduleName = 'ovhManagerHubPaymentStatusTile';

angular
  .module(moduleName, [
    hubTile,
    ngAtInternet,
    'ngOvhFeatureFlipping',
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerBillingComponents,
    ovhManagerHubTileError,
    ovhManagerProducts,
  ])
  .component('hubPaymentStatus', paymentStatusTile)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
