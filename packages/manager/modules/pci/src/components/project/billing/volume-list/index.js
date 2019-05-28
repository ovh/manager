import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import '@ovh-ux/ng-ovh-responsive-popover';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import detailsPopover from '../details-popover';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingVolumeList';

angular
  .module(moduleName, [
    detailsPopover,
    'ngOvhResponsivePopover',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .component('volumeList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
