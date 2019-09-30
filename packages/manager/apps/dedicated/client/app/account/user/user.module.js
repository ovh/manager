import set from 'lodash/set';

import './newAccountForm/new-account-form.module';
import config from '../../config/config';

angular
  .module('UserAccount', [
    'ja.qr',
    'ngOvhUtils',
    'ovhSignupApp',
  ])
  .constant('UserAccount.constants', {
    aapiRootPath: config.aapiRootPath,
    swsProxyRootPath: config.swsProxyRootPath,
    target: config.target,
  })
  .constant('CountryConstants', {
    support: config.constants.URLS.support,
  })
  .constant('AccountCreationURLS', config.constants.accountCreation)
  .config([
    '$stateProvider',
    'UserAccount.constants',
    ($stateProvider, userAccountConstants) => {
      const { target } = userAccountConstants;
      const baseUrl = 'account/user/';

      $stateProvider.state('app.account.useraccount', {
        url: '/useraccount',
        controller: 'UserAccount.controllers.main',
        templateUrl: `${baseUrl}/user.html`,
        translations: { value: ['.'], format: 'json' },
        abstract: true,
      });

      $stateProvider.state('app.account.service.useraccount', {
        url: '/useraccount',
        controller: 'UserAccount.controllers.main',
        templateUrl: `${baseUrl}/user.html`,
        abstract: true,
        translations: { value: ['.'], format: 'json' },
      });

      $stateProvider.state('app.account.useraccount.advanced', {
        url: '/advanced',
        templateUrl: `${baseUrl}advanced/user-advanced.html`,
        controller: 'UserAccount.controllers.advanced',
        controllerAs: 'advancedCtrl',
      });

      $stateProvider.state('app.account.useraccount.infos', {
        url: '/infos',
        templateUrl: `${baseUrl}infos/user-infos.html`,
        controller: 'UserAccount.controllers.Infos',
        translations: { value: ['./newAccountForm'], format: 'json' },
      });

      if (target === 'EU' || target === 'CA') {
        $stateProvider.state('app.account.useraccount.emails', {
          url: '/emails',
          templateUrl: `${baseUrl}emails/user-emails.html`,
          controller: 'UserAccount.controllers.emails',
        });

        $stateProvider.state('app.account.useraccount.emailsDetails', {
          url: '/emails/:emailId',
          templateUrl: `${baseUrl}emails/details/user-emails-details.html`,
          controller: 'UserAccount.controllers.emails.details',
        });
      }

      $stateProvider.state('app.account.useraccount.security', {
        url: '/security',
        templateUrl: `${baseUrl}security/user-security.html`,
        controller: 'UserAccount.controllers.doubleAuth',
      });

      $stateProvider.state('app.account.useraccount.users', {
        url: '/security/users',
        templateUrl: `${baseUrl}security/users/users.html`,
        controller: 'UserAccountUsersCtrl',
        translations: { value: ['./security/users'], format: 'json' },
      });
    },
  ])
  .constant('sshkey-regex', [
    {
      name: 'RSA',
      regex: /^(ssh-rsa)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
    },
    {
      name: 'ECDSA',
      regex: /^(ecdsa-sha2-nistp[0-9]+)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
    },
    {
      name: 'ED25519',
      regex: /^(ssh-ed25519)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
    },
  ])
  .run([
    '$rootScope',
    'UserAccount.constants',
    ($rootScope, userAccountConstants) => {
      set($rootScope, 'target', userAccountConstants.target);
      set($rootScope, 'worldPart', userAccountConstants.target);
    },
  ]);
