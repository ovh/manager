import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import routing from './orderTime2Chat.routing';
import component from './orderTime2Chat.component';

const moduleName = 'ovhManagerSmsOrderTime2ChatComponent';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'ui.router'])
  .config(routing)
  .component('smsOrderTime2ChatComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
