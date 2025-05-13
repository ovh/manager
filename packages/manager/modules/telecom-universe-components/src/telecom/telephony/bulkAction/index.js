import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';
import 'angular-ui-bootstrap';
import '@ovh-ux/ui-kit';

import tucTelephonyBulkActionModalCtrl from './modal/telephony-bulk-action-modal.controller';
import tucTelephonyBulkActionCtrl from './telephony-bulk-action.component.controller';
import tucTelephonyBulkAction from './telephony-bulk-action.component';
import tucTelephonyBulkActionUpdatedServicesContainer from './telephony-bulk-action-updated-services-container.factory';
import tucTelephonyBulk from './telephony-bulk-action.service';

import './telephony-bulk-action.less';

const moduleName = 'tucTelecomTelephonyBulkAction';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    translate,
    'ui.bootstrap',
  ])
  .controller(
    'tucTelephonyBulkActionModalCtrl',
    tucTelephonyBulkActionModalCtrl,
  )
  .controller('tucTelephonyBulkActionCtrl', tucTelephonyBulkActionCtrl)
  .component('tucTelephonyBulkAction', tucTelephonyBulkAction)
  .factory(
    'tucTelephonyBulkActionUpdatedServicesContainer',
    tucTelephonyBulkActionUpdatedServicesContainer,
  )
  .service('tucTelephonyBulk', tucTelephonyBulk)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
