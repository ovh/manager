import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './order-public-ip.routing';
import orderPublicIp from '../../components/order-public-ip';

const moduleName = 'ovhManagerAnthosDashboardOrderPublicIp';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    orderPublicIp,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
