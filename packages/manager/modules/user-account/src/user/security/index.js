import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';

import routing from './user-security.routing';

import userIpRestrictionAddTemplate from '../ip/restriction/add/user-ip-restriction-add.html';
import userIpRestrictionDeleteTemplate from '../ip/restriction/delete/user-ip-restriction-delete.html';

import ipRestrictionController from '../ip/restriction/user-ip-restriction.controller';
import ipRestrictionAddController from '../ip/restriction/add/user-ip-restriction-add.controller';
import ipRestrictionDeleteController from '../ip/restriction/delete/user-ip-restriction-delete.controller';

import userAccountDoubleAuthBackupCodeController from './backupCode/user-security-backupCode.controller';
import userAccountDoubleAuthBackupCodeDeleteController from './backupCode/delete/user-security-backupCode.controller';
import userAccountDoubleAuthBackupCodeManageController from './backupCode/manage/user-security-backupCode-manage.controller';

import userAccountDoubleAuthSmsController from './sms/user-security-sms.controller';
import userAccountDoubleAuthSmsAddController from './sms/add/user-security-sms-add.controller';
import userAccountDoubleAuthSmsDeleteController from './sms/delete/user-security-sms-delete.controller';
import userAccountDoubleAuthSmsEditController from './sms/edit/user-security-sms-edit.controller';

import userAccountDoubleAuthTotpController from './totp/user-security-totp.controller';
import userAccountDoubleAuthTotpAddController from './totp/add/user-security-totp-add.controller';
import userAccountDoubleAuthTotpDeleteController from './totp/delete/user-security-totp-delete.controller';
import userAccountDoubleAuthTotpEditController from './totp/edit/user-security-totp-edit.controller';

import userAccountDoubleAuthU2fController from './u2f/user-security-u2f.controller';
import userAccountDoubleAuthU2fAddCtrl from './u2f/add/user-security-u2f-add.controller';
import userAccountDoubleAuthU2fDeleteCtrl from './u2f/delete/user-security-u2f-delete.controller';
import userAccountDoubleAuthU2fEditCtrl from './u2f/edit/user-security-u2f-edit.controller';

import UserAccountServicesDoubleAuthSms from './sms/user-security-sms.service';
import UserAccountDoubleAuthTotpService from './totp/user-security-totp.service';
import UserAccountDoubleAuthU2fService from './u2f/user-security-u2f.service';
import UserAccountDoubleAuthBackupCodeService from './backupCode/user-security-backupCode.service';

import userSecurity2fa from './2fa';

import UserAccountIpRestrictionsService from '../ip/restriction/user-ip-restriction.service';

const moduleName = 'ovhManagerDedicatedAccountUserSecurity';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    userSecurity2fa,
  ])
  .config(routing)
  .controller('IpRestrictionCtrl', ipRestrictionController)
  .controller('IpRestrictionAddCtrl', ipRestrictionAddController)
  .controller('IpRestrictionDeleteCtrl', ipRestrictionDeleteController)
  .controller(
    'UserAccountDoubleAuthBackupCodeCtrl',
    userAccountDoubleAuthBackupCodeController,
  )
  .controller(
    'UserAccountDoubleAuthBackupCodeDeleteCtrl',
    userAccountDoubleAuthBackupCodeDeleteController,
  )
  .controller(
    'UserAccountDoubleAuthBackupCodeManageCtrl',
    userAccountDoubleAuthBackupCodeManageController,
  )
  .controller(
    'UserAccountDoubleAuthSmsCtrl',
    userAccountDoubleAuthSmsController,
  )
  .controller(
    'UserAccountDoubleAuthSmsAddCtrl',
    userAccountDoubleAuthSmsAddController,
  )
  .controller(
    'UserAccountDoubleAuthSmsDeleteCtrl',
    userAccountDoubleAuthSmsDeleteController,
  )
  .controller(
    'UserAccountDoubleAuthSmsEditCtrl',
    userAccountDoubleAuthSmsEditController,
  )
  .controller(
    'UserAccountDoubleAuthTotpCtrl',
    userAccountDoubleAuthTotpController,
  )
  .controller(
    'UserAccountDoubleAuthTotpAddCtrl',
    userAccountDoubleAuthTotpAddController,
  )
  .controller(
    'UserAccountDoubleAuthTotpDeleteCtrl',
    userAccountDoubleAuthTotpDeleteController,
  )
  .controller(
    'UserAccountDoubleAuthTotpEditCtrl',
    userAccountDoubleAuthTotpEditController,
  )
  .controller(
    'UserAccountDoubleAuthU2fController',
    userAccountDoubleAuthU2fController,
  )
  .controller(
    'UserAccountDoubleAuthU2fAddCtrl',
    userAccountDoubleAuthU2fAddCtrl,
  )
  .controller(
    'UserAccountDoubleAuthU2fDeleteCtrl',
    userAccountDoubleAuthU2fDeleteCtrl,
  )
  .controller(
    'UserAccountDoubleAuthU2fEditCtrl',
    userAccountDoubleAuthU2fEditCtrl,
  )

  .service('DoubleAuthTotpService', UserAccountDoubleAuthTotpService)
  .service('DoubleAuthSmsService', UserAccountServicesDoubleAuthSms)
  .service('DoubleAuthU2fService', UserAccountDoubleAuthU2fService)
  .service(
    'DoubleAuthBackupCodeService',
    UserAccountDoubleAuthBackupCodeService,
  )
  .service('IpRestrictionsService', UserAccountIpRestrictionsService)
  .run([
    '$templateCache',
    ($templateCache) => {
      $templateCache.put(
        'account/user/ip/restriction/add/user-ip-restriction-add.html',
        userIpRestrictionAddTemplate,
      );
      $templateCache.put(
        'account/user/ip/restriction/delete/user-ip-restriction-delete.html',
        userIpRestrictionDeleteTemplate,
      );
    },
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
