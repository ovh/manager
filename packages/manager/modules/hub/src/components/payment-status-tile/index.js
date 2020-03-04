import 'ovh-ui-kit/dist/oui.css';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-ui-angular';

import paymentStatusTile from './payment-status-tile.component';
import hubTile from '../tile';

import './payment-status-tile.scss';
import './payment-status-tile.less';

const moduleName = 'ovhManagerHubPaymentStatusTile';

angular
  .module(moduleName, [ngAtInternet, 'ngTranslateAsyncLoader', hubTile, 'oui'])
  .component('hubPaymentStatus', paymentStatusTile)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
