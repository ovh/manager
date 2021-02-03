import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; //eslint-disable-line

import { RejectType } from '@uirouter/angularjs';
import { get, has } from 'lodash-es';

import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import uiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerFreeFax from '@ovh-ux/manager-freefax';
import managerNotificationsSidebar from '@ovh-ux/manager-notifications-sidebar';
import managerAccountSidebar from '@ovh-ux/manager-account-sidebar';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import { Environment } from '@ovh-ux/manager-config';

import controller from './controller';

import './index.scss';

const moduleName = 'freefaxApp';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngOvhApiWrappers,
    ovhManagerFreeFax,
    uiRouterBreadcrumb,
    managerNotificationsSidebar,
    managerAccountSidebar,
    ...get(__NG_APP_INJECTIONS__, Environment.getRegion(), []),
  ])
  .controller('FreefaxAppController', controller)
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/freefax'),
  )
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  )
  .run(
    /* @ngInject */ ($state) => {
      $state.defaultErrorHandler((error) => {
        if (error.type === RejectType.ERROR) {
          $state.go(
            'error',
            {
              detail: {
                message: get(error.detail, 'data.message'),
                code: has(error.detail, 'headers')
                  ? error.detail.headers('x-ovh-queryId')
                  : null,
              },
            },
            { location: false },
          );
        }
      });
    },
  )
  .run(
    /* @ngInject */ ($rootScope, $transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        $rootScope.$broadcast('app:started');
        unregisterHook();
      });
    },
  );

export default moduleName;
