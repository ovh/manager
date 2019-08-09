import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import translate from 'angular-translate';

/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
import 'script-loader!@ovh-ux/ovh-utils-angular/bin/ovh-utils-angular.min.js';
import 'script-loader!@ovh-ux/ovh-utils-angular/lib/core.js';
import 'script-loader!df-tab-menu/build/df-tab-menu.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */

import ducOvhTabsDirective from './tabs.directive';

const moduleName = 'ducTabs';

angular
  .module(moduleName, [
    'digitalfondue.dftabmenu',
    ngTranslateAsyncLoader,
    'ovh-utils-angular',
    translate,
  ])
  .directive('ducOvhTabs', ducOvhTabsDirective)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
