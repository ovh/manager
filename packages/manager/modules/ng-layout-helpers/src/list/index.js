import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-api-wrappers';

import ListLayoutCtrl from './list-layout.controller';
import component from './list-layout.component';
import utils from './list-layout.utils';
import components from './components';

const moduleName = 'ovhManagerListLayout';

angular
  .module(moduleName, [
    'oui',
    'ngOvhApiWrappers',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    components,
  ])
  .component('managerListLayout', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default {
  ...utils,
  ListLayoutCtrl,
  moduleName,
};
