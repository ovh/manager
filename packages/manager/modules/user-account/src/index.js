import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import '@ovh-ux/ui-kit';
import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'angular-ui-bootstrap';

// import './otrs/otrs-controllers.module';
// import './otrs/otrs-directives.module';
// import './otrs/otrs-filters.module';
// import './otrs/otrs-services.module';
// import './otrs/otrs.app';

// import './account/user/advanced/advanced.module';
// import './account/user/dashboard/user-dahboard.module';
// import './account/user/newAccountForm/new-account-form.module';
// import './account/user/support-level/support-level.module';

import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import UserAccount from './user/user.module';
import routing from './account.routing';

import service from './service';

const moduleName = 'ovhManagerDedicatedAccount';

angular
  .module(moduleName, [
    ngOvhOtrs,
    ngOvhUtils,
    'ovhManagerCore',
    'pascalprecht.translate',
    // 'Module.otrs',
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    UserAccount,
  ])
  .config(routing)
  .service('UserAccountService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
