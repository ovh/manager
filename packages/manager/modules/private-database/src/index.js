/* global moment */

import angular from 'angular';
import _ from 'lodash';

import '@ovh-ux/manager-core';
import '@ovh-ux/ovh-utils-angular';
import '@ovh-ux/ng-ovh-web-universe-components';
import 'angularjs-scroll-glue';
import 'chart.js/dist/Chart';
import '@ovh-ux/ng-pagination-front';
import '@ovh-ux/ng-tail-logs';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import 'font-awesome/css/font-awesome.css';
import './private-database.scss';
import './private-database.less';

import privateDatabaseUser from './user';
import privateDatabaseDatabase from './database';

import controller from './private-database.controller';
import configurationController from './configuration/private-database-configuration.controller';
import logsController from './logs/private-database-logs.controller';
import metricsController from './metrics/private-database-metrics.controller';
import oomController from './oom/private-database-oom.controller';
import tabsController from './private-database-tabs.controller';
import stateController from './state/private-database-state.controller';
import taskController from './task/private-database-task.controller';

import template from './private-database.html';
import configurationTemplate from './configuration/private-database-configuration.html';
import logsTemplate from './logs/private-database-logs.html';
import metricsTemplate from './metrics/private-database-metrics.html';
import oomTemplate from './oom/private-database-oom.html';
import stateTemplate from './state/private-database-state.html';
import taskTemplate from './task/private-database-task.html';

import privateDatabaseService from './private-database.service';
import privateDatabaseLogsService from './logs/private-database-logs.service';
import privateDatabaseOomService from './oom/private-database-oom.service';
import whitelistService from './whitelist/private-database-whitelist.service';

const moduleName = 'ovhManagerPrivateDatabase';

angular.module(moduleName, [
  'ngTailLogs',
  'ngPaginationFront',
  'ovh-utils-angular',
  'ovhManagerCore',
  'oui',
  privateDatabaseUser,
  privateDatabaseDatabase,
  'ngOvhWebUniverseComponents',
])
  .run(($templateCache) => {
    $templateCache.put('private-database/configuration/private-database-configuration.html', configurationTemplate);
    $templateCache.put('private-database/logs/private-database-logs.html', logsTemplate);
    $templateCache.put('private-database/metrics/private-database-metrics.html', metricsTemplate);
    $templateCache.put('private-database/oom/private-database-oom.html', oomTemplate);
    $templateCache.put('private-database/state/private-database-state.html', stateTemplate);
    $templateCache.put('private-database/task/private-database-task.html', taskTemplate);
  })
  .service('PrivateDatabase', privateDatabaseService)
  .service('PrivateDatabaseLogsService', privateDatabaseLogsService)
  .service('OomService', privateDatabaseOomService)
  .service('WhitelistService', whitelistService)
  .controller('PrivateDatabaseConfigurationsCtrl', configurationController)
  .controller('PrivateDatabaseLogsCtrl', logsController)
  .controller('PrivateDatabaseMetricsCtrl', metricsController)
  .controller('PrivateDatabaseOomCtrl', oomController)
  .controller('PrivateDatabaseTabsCtrl', tabsController)
  .controller('PrivateDatabaseStateCtrl', stateController)
  .controller('PrivateDatabaseTasksCtrl', taskController)
  .config(($stateProvider) => {
    $stateProvider.state('private-database', {
      url: '/configuration/private_database/:serviceName?tab',
      template,
      controller,
      controllerAs: '$ctrl',
      reloadOnSearch: false,
      resolve: {
        navigationInformations: [
          'Navigator',
          '$rootScope',
          (Navigator, $rootScope) => {
            $rootScope.currentSectionInformation = 'private_database'; // eslint-disable-line no-param-reassign
            return Navigator.setNavigationInformation({
              leftMenuVisible: true,
              configurationSelected: true,
            });
          },
        ],
      },
      translations: ['.'],
    });
  })
  .run(($translate) => {
    const selectedLanguageValue = $translate.use();

    if (_(moment).isObject() && _(selectedLanguageValue).isString()) {
      const locale = selectedLanguageValue.replace(/_/, '-');
      moment.locale(locale);
    }
  });

export default moduleName;
