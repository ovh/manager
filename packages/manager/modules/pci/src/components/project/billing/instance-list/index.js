import angular from 'angular';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import 'angular-ui-bootstrap';
import flavorsListService from '../../flavors-list/flavors-list.service';

import detailsPopover from '../details-popover';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingInstanceList';

angular
  .module(moduleName, [
    detailsPopover,
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .component('instanceList', component)
  .service('flavorsListService', flavorsListService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
