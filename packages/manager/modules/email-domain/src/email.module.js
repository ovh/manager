import angular from 'angular';

import 'angular-translate';
import 'angular-ui-bootstrap';
import 'bootstrap';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import webUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ui-router-layout';

import dashboard from './dashboard/email-domain.module';
import delegate from './delegate/delegate.module';
import email from './email/email.module';
import generalInformations from './general-informations/information.module';
import mailingList from './mailing-list/mailing-list.module';
import order from './order';
import routing from './email.routing';
import task from './task/task.module';
import upgrade from './upgrade';

const moduleName = 'ovhManagerEmailDomain';

angular
  .module(moduleName, [
    dashboard,
    delegate,
    email,
    generalInformations,
    mailingList,
    ngOvhUtils,
    'ngUiRouterLayout',
    ngPaginationFront,
    ngTranslateAsyncLoader,
    order,
    'oui',
    'pascalprecht.translate',
    task,
    upgrade,
    'ui.bootstrap',
    webUniverseComponents,
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
