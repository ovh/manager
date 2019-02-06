import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';
import '@ovh-ux/manager-telecom-styles';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import 'ovh-api-services';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import resiliation from './resiliation';

import { DASHBOARD_SERVICES, PACK } from './constants';

import controller from './controller';
import template from './template.html';

import slots from './slots';

import './index.scss';

const moduleName = 'ovhManagerPackModule';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ovhManagerCore',
    'ngOvhTelecomUniverseComponents',
    'ui.router',
    resiliation,
    slots,
  ])
  .constant('PACK_DASHBOARD_SERVICES', DASHBOARD_SERVICES)
  .constant('PACK_PACK', PACK)
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pack', {
      url: '/pack/:packName',
      controller,
      template,
      controllerAs: 'Pack',

      resolve: {
        resiliationNotification() {
          return {};
        },
        $title(translations, $translate, OvhApiPackXdsl, $stateParams) {
          return OvhApiPackXdsl.v6().get({
            packId: $stateParams.packName,
          }).$promise
            .then(data => $translate.instant('pack_xdsl_page_title', { name: data.description || $stateParams.packName }, null, null, 'escape'))
            .catch(() => $translate.instant('pack_xdsl_page_title', { name: $stateParams.packName }));
        },
      },
      translations: [
        '.',
        './common',
        './slots/emailPro',
      ],
    });
  });

export default moduleName;
