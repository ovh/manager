import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import routing from './vps-kvm.routing';
import component from './vps-kvm.component';
import ovhManagerVpsKvmNovnc from './novnc/novnc.module';

import './vps-kvm.less';

const moduleName = 'vpsDashboardKvmModule';

angular
  .module(moduleName, [ovhManagerVpsKvmNovnc, 'oui', 'ui.router'])
  .config(routing)
  .component('vpsDashboardKvm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
