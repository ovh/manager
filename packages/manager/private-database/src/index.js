import angular from 'angular';
import managerCore from '@ovh-ux/manager-core';
import ovhUtilsAngular from '@ovh-ux/ovh-utils-angular';
import webUniverseComponents from '@ovh-ux/web-universe-components';

import controller from './private-database.controller';
import tabsController from './private-database-tabs.controller';
import template from './private-database.html';
import privateDatabaseService from './private-database.service';
import privateDatabaseExtensionService from './database/extension/private-database-database-extension.service';

const moduleName = 'ovhManagerPrivateDatabase';

angular.module(moduleName, [
  managerCore,
  ovhUtilsAngular,
  webUniverseComponents,
])
  .service('PrivateDatabase', privateDatabaseService)
  .service('PrivateDatabaseExtension', privateDatabaseExtensionService)
  .controller('PrivateDatabaseTabsCtrl', tabsController)
  .config(($stateProvider) => {
    $stateProvider.state('private-database', {
      url: '/configuration/private_database/:serviceName?tab',
      template,
      controller,
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
