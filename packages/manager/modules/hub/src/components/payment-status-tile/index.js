import 'ovh-ui-kit/dist/oui.css';
import './payment-status-tile.less';

import ngAtInternet from '@ovh-ux/ng-at-internet';
import 'ovh-api-services';
import 'ovh-ui-angular';

import paymentStatusTile from './payment-status-tile.component';

const moduleName = 'ovhManagerHubPaymentStatusTile';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'ovh-api-services'])
  .component('ovhManagerHubPaymentStatusTile', paymentStatusTile)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
