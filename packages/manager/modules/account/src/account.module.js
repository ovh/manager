import contacts from './contacts';
import contactUpdate from './contacts/update';
import redirection from './account.redirection';
import routing from './account.routing';
import user from './user';
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
