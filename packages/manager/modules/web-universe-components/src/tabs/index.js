import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-utils';
import 'angular-ui-bootstrap';
import 'df-tab-menu/build/df-tab-menu.min';

import wucOvhTabsDirective from './tabs.directive';

const moduleName = 'wucTabs';

angular
  .module(moduleName, [
    'digitalfondue.dftabmenu',
    'ngTranslateAsyncLoader',
    'ngOvhUtils',
    translate,
    'ui.bootstrap',
  ])
  .directive('wucOvhTabs', wucOvhTabsDirective)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
