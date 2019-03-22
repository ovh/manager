import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'angular-ui-bootstrap';

import detailsPopover from '../details-popover';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingHourlyResourceList';

angular
  .module(moduleName, [
    detailsPopover,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .component('hourlyResourceList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
