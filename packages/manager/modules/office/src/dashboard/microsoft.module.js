import angular from 'angular';
import 'angular-route';
import 'angular-ui-bootstrap';
import 'bootstrap';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-web-universe-components';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import routing from './microsoft.routes';

import licenseConsumptionConstant from './office/license/consumption/microsoft-office-license-consumption.constants';
import licenseConsumptionCtrl from './office/license/consumption/microsoft-office-license-consumption.controller';
import licenseTabsCtrl from './office/license/microsoft-office-license-tabs.controller';
import licenseEditCtrl from './office/license/edit/microsoft-office-license-edit.controller';
import licenseUserCtrl from './office/license/user/microsoft-office-license-user.controller';
import licenseUserAddCtrl from './office/license/user/add/microsoft-office-license-user-add.controller';
import licenseUserDeleteCtrl from './office/license/user/delete/microsoft-office-license-user-delete.controller';
import licenseUserOrderCtrl from './office/license/user/order/microsoft-office-license-user-order.controller';
import licenseUserUpdateCtrl from './office/license/user/update/microsoft-office-license-user-update.controller';
import passwordEditCtrl from './office/license/edit/password/microsoft-office-edit-password.controller';
import licenseService from './microsoft-office-license.service';

import userOrderTpl from './office/license/user/order/microsoft-office-license-user-order.html';
import userUpdateTpl from './office/license/user/update/microsoft-office-license-user-update.html';
import userDeleteTpl from './office/license/user/delete/microsoft-office-license-user-delete.html';
import userAddTpl from './office/license/user/add/microsoft-office-license-user-add.html';
import passwordEditTpl from './office/license/edit/password/microsoft-office-edit-password.html';
import licenseEditTpl from './office/license/edit/microsoft-office-license-edit.html';

import user from './office/license/user/user.module';
import consumption from './office/license/consumption/consumption.module';

import './microsoft.less';

const moduleName = 'Module.microsoft';

angular
  .module('Module.microsoft.controllers', [])
  .constant('OFFICE_LICENSE_CONSUMPTION', licenseConsumptionConstant)
  .controller('MicrosoftOfficeLicenseTabsCtrl', licenseTabsCtrl)
  .controller('MicrosoftOfficeLicenseConsumptionCtrl', licenseConsumptionCtrl)
  .controller('MicrosoftOfficeLicenseEditCtrl', licenseEditCtrl)
  .controller('MicrosoftOfficePasswordEditCtrl', passwordEditCtrl)
  .controller('MicrosoftOfficeLicenseUsersCtrl', licenseUserCtrl)
  .controller('MicrosoftOfficeLicenseUserAddCtrl', licenseUserAddCtrl)
  .controller('MicrosoftOfficeLicenseUserDeleteCtrl', licenseUserDeleteCtrl)
  .controller('MicrosoftOfficeLicenseUserOrderCtrl', licenseUserOrderCtrl)
  .controller('MicrosoftOfficeLicenseUserUpdateCtrl', licenseUserUpdateCtrl);

angular
  .module(moduleName, [
    'ngOvhUtils',
    'ngRoute',
    'ui.bootstrap',
    'ngSanitize',
    'ngOvhWebUniverseComponents',
    'Module.microsoft.controllers',
    user,
    consumption,
  ])
  .service('MicrosoftOfficeLicenseService', licenseService)
  .config(routing)
  .constant('MICROSOFT_GUIDE_URLS', {})
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'microsoft/office/license/user/order/microsoft-office-license-user-order.html',
        userOrderTpl,
      );
      $templateCache.put(
        'microsoft/office/license/user/update/microsoft-office-license-user-update.html',
        userUpdateTpl,
      );
      $templateCache.put(
        'microsoft/office/license/user/delete/microsoft-office-license-user-delete.html',
        userDeleteTpl,
      );
      $templateCache.put(
        'microsoft/office/license/user/add/microsoft-office-license-user-add.html',
        userAddTpl,
      );
      $templateCache.put(
        'microsoft/office/license/edit/password/microsoft-office-edit-password.html',
        passwordEditTpl,
      );
      $templateCache.put(
        'microsoft/office/license/edit/microsoft-office-license-edit.html',
        licenseEditTpl,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
