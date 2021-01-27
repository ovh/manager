import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './sla.routing';
import service from './billing-sla.service';

const moduleName = 'ovhManagerBillingSla';

angular
  .module(moduleName, [
    ngAtInternet,
    ngOvhUtils,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .service('BillingSla', service)
  .config(routing);

export default moduleName;
