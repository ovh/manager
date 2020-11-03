import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import 'angular-ui-bootstrap';

import '@ovh-ux/ui-kit';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import './css/source.less';

import '@ovh-ux/ng-ovh-dedicated-universe-components';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';

import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import UserAccount from './user/user.module';

import service from './service';

const moduleName = 'ovhManagerAccountUser';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ovhManagerCore',
    'pascalprecht.translate',
    'oui',
    'ui.bootstrap',
    'ui.router',
    ngOvhOtrs,
    ngPaginationFront,
    ngOvhUiRouterLayout,
    UserAccount,
  ])
  .service('UserAccountService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
