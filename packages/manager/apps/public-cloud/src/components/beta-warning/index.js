import angular from 'angular';
import 'ovh-ui-angular';
import ngOvhSidebarMenu from '@ovh-ux/ng-ovh-sidebar-menu';

import component from './beta-warning.component';

import './beta-warning.less';

const moduleName = 'ovh-manager-betaWarning';

angular
  .module(moduleName, [
    'oui',
    ngOvhSidebarMenu,
  ])
  .component('betaWarning', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
