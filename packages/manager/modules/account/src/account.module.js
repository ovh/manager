import contacts from './contacts/user-contacts.module';
import contactUpdate from './contacts/update';
import contactRequest from './contacts/request';
import redirection from './account.redirection';
import routing from './account.routing';
import user from './user';
import ExitGuardService from './utils/exitGuard.service';
import identityDocuments from './identity-documents';
import kycDocuments from './kyc-documents';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-feature-flipping';

const moduleName = 'ovhManagerModuleAccount';

angular
  .module(moduleName, [
    contacts,
    contactUpdate,
    contactRequest,
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    user,
    identityDocuments,
    kycDocuments,
    'ngUiRouterBreadcrumb',
    'oc.lazyLoad',
    'ui.select',
    'ngOvhFeatureFlipping',
    'ovhManagerCore',
  ])
  .config(redirection)
  .config(routing)
  .service('ExitGuardService', ExitGuardService)
  .run(/* @ngTranslationsInject:json ./common/translations */)
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  );

export default moduleName;
