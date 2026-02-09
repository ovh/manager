/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!moment/min/moment.min';
/* eslint-enable import/no-webpack-loader-syntax */

import { isString, get } from 'lodash-es';

import angular from 'angular';
import 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import { registerCoreModule } from '@ovh-ux/manager-core';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ovhManagerSms from '@ovh-ux/manager-sms';

export default (containerEl, environment) => {
  const moduleName = 'smsApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngOvhApiWrappers,
        ngUiRouterBreadcrumb,
        ovhManagerSms,
        'pascalprecht.translate',
        uiRouter,
        ngPaginationFront,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/sms');
      },
    )
    .constant('CHANGELOG', {
      sms: {
        links: {
          changelog:
            'https://github.com/orgs/ovh/projects/18/views/2?pane=info&sliceBy%5Bvalue%5D=VoIP',
          roadmap:
            'https://github.com/orgs/ovh/projects/18/views/1?pane=info&sliceBy%5Bvalue%5D=VoIP',
          'feature-request':
            'https://github.com/ovh/collaborative-tools-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
        },
        chapters: ['telecom', 'sms', ''],
      },
    })
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
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: false,
  });

  return moduleName;
};
