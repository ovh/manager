import angular from 'angular';

import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/manager-telecom-styles';
import '@ovh-ux/ng-ui-router-title';
import 'angular-ui-bootstrap';
import 'ovh-api-services';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';

import { STATUS, PAGINATION_PER_PAGE } from './task.constants';
import controller from './task.controller';
import template from './task.html';

export default angular
  .module('OvhManagerTelecomTaskComponent', [
    'ngOvhTelecomUniverseComponents',
    'ngUiRouterTitle',
    'ovh-api-services',
    'ui.bootstrap',
    'ui.router',
  ])
  .constant('TELECOM_TASK_PAGINATION_PER_PAGE', PAGINATION_PER_PAGE)
  .constant('TELECOM_TASK_STATUS', STATUS)
  .component('ovhManagerTelecomTaskComponent', {
    template,
    controller,
    controllerAs: 'TaskCtrl',
  })
  .config(($stateProvider) => {
    $stateProvider.state('task', {
      url: '/task',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        $title(translations, $translate) {
          return $translate('telecom_task_page_title');
        },
      },
      component: 'ovhManagerTelecomTaskComponent',
    });
  });
