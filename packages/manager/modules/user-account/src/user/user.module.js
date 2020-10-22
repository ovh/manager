import set from 'lodash/set';

import './newAccountForm/new-account-form.module';
import advanced from './advanced/advanced.module';
import config from '../config/config';
import dashboard from './dashboard/user-dahboard.module';
import supportLevel from './support-level/support-level.module';
import infos from './infos';

import '@ovh-ux/ui-kit';

import routing from './user.routes';

const moduleName = 'UserAccount';

angular
  .module(moduleName, [
    // 'ja.qr',
    'ngOvhUtils',
    'ovhSignupApp',
    'oui',
    // advanced,
    dashboard,
    infos,
    // supportLevel,
  ])
  .config(routing)
  .constant('constants', {
    aapiRootPath: config.aapiRootPath,
    swsProxyRootPath: config.swsProxyRootPath,
    target: config.target,
  })
  .constant('CountryConstants', {
    support: config.constants.URLS.support,
  })
  .constant('AccountCreationURLS', config.constants.accountCreation)
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
    'constants',
    ($rootScope, constants) => {
      set($rootScope, 'target', constants.target);
      set($rootScope, 'worldPart', constants.target);
    },
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
