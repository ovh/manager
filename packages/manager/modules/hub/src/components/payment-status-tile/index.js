import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

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
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerHubTileError,
    ovhManagerProducts,
  ])
  .component('hubPaymentStatus', paymentStatusTile)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
