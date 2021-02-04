import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import routing from './sla.routing';
import service from './billing-sla.service';

const moduleName = 'ovhManagerBillingSla';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngOvhUtils,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .service('BillingSla', service)
  .config(routing);

export default moduleName;
