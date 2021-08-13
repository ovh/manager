import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import orderHost from '../../components/order-host';
import routing from './routing';

const moduleName = 'ovhManagerAnthosDashboardHostOrder';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router', orderHost])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
