import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/manager-telecom-styles';
import 'angularjs-scroll-glue';

import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-ui-router-title';
import '@ovh-ux/ng-tail-logs';
import ngOvhUiConfirmModal from '@ovh-ux/ng-ovh-ui-confirm-modal';

import constant from './overTheBox.constant';

import actions from './actions';
import configure from './configure';
import details from './details';
import docs from './docs';
import logs from './logs';
import order from './order';
import remote from './remote';
import tasks from './tasks';

import routing from './overTheBox.routing';
import component from './overTheBox.component';

import './overTheBox.scss';

const moduleName = 'OvhManagerOverTheBoxComponent';

angular
  .module(moduleName, [
    'ngTailLogs',
    'ngOvhTelecomUniverseComponents',
    'ngUiRouterTitle',
    ngOvhUiConfirmModal,
    actions,
    configure,
    details,
    docs,
    logs,
    order,
    remote,
    tasks,
  ])
  .config(routing)
  .component('ovhManagerOverTheBoxComponent', component)
  .constant('OVER_THE_BOX', constant)
  .constant('PAGINATION_PER_PAGE', 5);

export default moduleName;
