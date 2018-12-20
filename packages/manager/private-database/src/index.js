import angular from 'angular';
import managerCore from '@ovh-ux/manager-core';
import ovhUtilsAngular from '@ovh-ux/ovh-utils-angular';
import webUniverseComponents from '@ovh-ux/web-universe-components';

import privateDatabaseUser from './user';
import privateDatabaseDatabase from './database';

import controller from './private-database.controller';
import tabsController from './private-database-tabs.controller';
import template from './private-database.html';
import privateDatabaseService from './private-database.service';

import privateDatabaseOomService from './oom/private-database-oom.service';
import stateController from './state/private-database-state.controller';

import stateTemplate from './state/private-database-state.html';

const moduleName = 'ovhManagerPrivateDatabase';

angular.module(moduleName, [
  managerCore,
  ovhUtilsAngular,
  privateDatabaseUser,
  privateDatabaseDatabase,
  webUniverseComponents,
])
  .run(($templateCache) => {
    // state
    $templateCache.put('private-database/state/private-database-state.html', stateTemplate);
  })
  .service('PrivateDatabase', privateDatabaseService)
  .service('OomService', privateDatabaseOomService)
  .controller('PrivateDatabaseTabsCtrl', tabsController)
  .controller('PrivateDatabaseStateCtrl', stateController)
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

  /*
  $stateProvider.state('app.private-database-order', {
    url: '/configuration/private_database',
    templateUrl: 'private-database/order/private-database-order.html',
    controller: 'PrivateDatabaseOrderCtrl',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation =
            'private_database'; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: ['../private-database'],
  });

  $stateProvider.state('app.sql-order', {
    url: '/configuration/sql_order?orderType&currentHosting',
    params: {
      currentHosting: { value: null, squash: true },
      orderType: { value: 'private' },
    },
    templateUrl: 'private-database/order/sql-database-order.html',
    controller: 'SqlDatabaseOrderCtrl',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation =
            'private_database'; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: ['../private-database'],
  });
  */
  });

export default moduleName;
