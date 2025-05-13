import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import routing from './creditTransfer.routing';
import component from './creditTransfer.component';

const moduleName = 'ovhManagerSmsCreditTransferComponent';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'ui.router'])
  .config(routing)
  .component('smsCreditTransferComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
