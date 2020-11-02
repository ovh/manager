import 'script-loader!jsurl/lib/jsurl.js'; // eslint-disable-line
import 'script-loader!qrcode.js/lib/qrcode.js'; // eslint-disable-line
import 'script-loader!ipaddr.js/ipaddr.min.js'; // eslint-disable-line

import angular from 'angular';
import 'angular-ui-bootstrap';
import 'angular-qr';
import 'bootstrap';
import 'punycode';

import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerCore from '@ovh-ux/manager-core';
import uiRouter from '@uirouter/angularjs';

import { Environment } from '@ovh-ux/manager-config';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

import UserAccount from '@ovh-ux/manager-user-account';

import './index.scss';

Environment.setVersion(__VERSION__);

const moduleName = 'UserAccountApp';

angular
  .module(moduleName, [
    'ui.bootstrap',
    ngOvhUiRouterLineProgress,
    ngUiRouterBreadcrumb,
    uiRouter,
    UserAccount,
    ovhManagerCore,
  ])
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
  )
  .run(
    /* @ngInject */ ($transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
  );

export default moduleName;
