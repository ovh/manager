import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/manager-telecom-styles';
import 'angularjs-scroll-glue';

import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-ui-router-title';
import '@ovh-ux/ng-tail-logs';
import 'ovh-angular-responsive-tabs';
import ngOvhUiConfirmModal from '@ovh-ux/ng-ovh-ui-confirm-modal';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit/dist/oui-olt.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.min.css';
import 'ovh-ui-kit-bs/dist/oui-bs3-olt.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';

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
    'ovh-angular-responsive-tabs',
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
  .constant('PAGINATION_PER_PAGE', 5)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./details/translations */)
  .run(/* @ngTranslationsInject:json ./warning/translations */)
  .run(/* @ngTranslationsInject:json ./remote/translations */);

export default moduleName;
