import angular from 'angular';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import backupCode from './backupCode/user-security-backupCode.module';
import twofa from './2fa/user-security-2fa.module';
import sms from './sms/user-security-sms.module';
import totp from './totp/user-security-totp.module';
import u2f from './u2f/user-security-u2f.module';
import routing from './user-security.routing';

const moduleName = 'ovhManagerDedicatedAccountUserSecurity';

angular
  .module(moduleName, [
    backupCode,
    managerCore,
    ngOvhUtils,
    'oc.lazyLoad',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    twofa,
    sms,
    totp,
    u2f,
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
