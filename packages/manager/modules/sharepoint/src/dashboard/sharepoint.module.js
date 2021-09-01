import angular from 'angular';
import 'angular-route';
import 'angular-ui-bootstrap';
import 'bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-web-universe-components';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import incrementNumber from '../account/add-legacy/incrementNumber';

import routing from './sharepoint.routes';
import accountCtrl from '../account/sharepoint-account.controller';
import accountAddCtrl from '../account/add/sharepoint-account-add.controller';
import accountAddLegacyCtrl from '../account/add-legacy/sharepoint-account-add-legacy.controller';
import accountDeleteCtrl from '../account/delete/sharepoint-account-delete.controller';
import updatePasswordCtrl from '../account/password/update/sharepoint-account-password-update.controller';
import updateAccountCtrl from '../account/update/sharepoint-account-update.controller';
import activateOfficeCtrl from '../activate/sharepoint-activate.controller';
import adminRightsCtrl from '../admin-rights/reset/sharepoint-admin-rights-reset.controller';
import domainsCtrl from '../domain/sharepoint-domain.controller';
import domainAddCtrl from '../domain/add/sharepoint-domain-add.controller';
import domainDeleteCtrl from '../domain/delete/sharepoint-domain-delete.controller';
import informationsCtrl from '../information/sharepoint-information.controller';
import orderCtrl from '../order/sharepoint-order.controller';
import updateRenewCtrl from '../renew/update/sharepoint-renew-update.controller';
import tasksCtrl from '../task/sharepoint-task.controller';
import urlCtrl from '../url/sharepoint-url.controller';
import sharepointCtrl from './sharepoint.controller';

import licenseService from './sharepoint.service';
import orderService from './sharepoint-order.service';

import renewUpdateTpl from '../renew/update/sharepoint-renew-update.html';
import activateTpl from '../activate/sharepoint-activate.html';
import adminRightsResetTpl from '../admin-rights/reset/sharepoint-admin-rights-reset.html';
import passwordUpdateTpl from '../account/password/update/sharepoint-account-password-update.html';
import accountUpdateTpl from '../account/update/sharepoint-account-update.html';
import accountDeleteTpl from '../account/delete/sharepoint-account-delete.html';
import userTpl from '../account/popover/user.html';
import accountAddTpl from '../account/add/sharepoint-account-add.html';
import accountAddLegacyTpl from '../account/add-legacy/sharepoint-account-add-legacy.html';
import domainDeleteTpl from '../domain/delete/sharepoint-domain-delete.html';
import domainAddTpl from '../domain/add/sharepoint-domain-add.html';

import information from '../information/information.module';
import account from '../account/account.module';
import task from '../task/task.module';
import domain from '../domain/domain.module';

const moduleName = 'Module.sharepoint';

angular
  .module('Module.sharepoint.controllers', [incrementNumber])
  .controller('SharepointCtrl', sharepointCtrl)
  .controller('SharepointAccountsCtrl', accountCtrl)
  .controller('SharepointAccountAddCtrl', accountAddCtrl)
  .controller('SharepointAccountAddLegacyCtrl', accountAddLegacyCtrl)
  .controller('SharepointDeleteAccountCtrl', accountDeleteCtrl)
  .controller('SharepointUpdatePasswordCtrl', updatePasswordCtrl)
  .controller('SharepointUpdateAccountCtrl', updateAccountCtrl)
  .controller('SharepointActivateOfficeCtrl', activateOfficeCtrl)
  .controller('SharepointResetAdminRightsCtrl', adminRightsCtrl)
  .controller('SharepointDomainsCtrl', domainsCtrl)
  .controller('SharepointAddDomainController', domainAddCtrl)
  .controller('SharepointDeleteDomainController', domainDeleteCtrl)
  .controller('SharepointInformationsCtrl', informationsCtrl)
  .controller('SharepointOrderCtrl', orderCtrl)
  .controller('SharepointUpdateRenewCtrl', updateRenewCtrl)
  .controller('SharepointTasksCtrl', tasksCtrl)
  .controller('SharepointUrlCtrl', urlCtrl);

angular
  .module('Module.sharepoint.services', [])
  .service('MicrosoftSharepointLicenseService', licenseService)
  .service('MicrosoftSharepointOrderService', orderService);

angular
  .module(moduleName, [
    'ngOvhUtils',
    'ngRoute',
    'ui.bootstrap',
    'ngSanitize',
    'Module.sharepoint.controllers',
    'Module.sharepoint.services',
    'ovh-api-services',
    'ngOvhWebUniverseComponents',
    information,
    account,
    task,
    domain,
  ])
  .config(routing)
  .constant('SHAREPOINT_GUIDE_URLS', {
    CZ: '',
    DE:
      'https://www.ovh.de/g2249.aktivierung_und_verwaltung_ihres_ovh_sharepoint',
    ES: 'https://www.ovh.es/g2249.activacion_y_gestion_de_un_sharepoint_ovh',
    FI:
      'https://www.ovh-hosting.fi/g2249.ovhn_sharepoint-hallintaliittyman_aktivointi',
    FR:
      'https://docs.ovh.com/fr/fr/web/microsoft-collaborative-solutions/activation-et-gestion-de-votre-sharepoint-ovh/',
    GB: 'https://www.ovh.co.uk/g2249.enable_and_manage_your_ovh_sharepoint',
    IT: '',
    LT: 'https://www.ovh.lt/g2249.ovh_sharepoint_ijungimas_ir_valdymas',
    NL: '',
    PL:
      'https://www.ovh.pl/g2249.aktywacja_uslugi_sharepoint_ovh_i_zarzadzanie_nia',
    PT: 'https://www.ovh.pt/g2249.ativacao_e_gestao_do_seu_sharepoint_ovh',
    CA: 'https://www.ovh.com/ca/en/g2249.enable_and_manage_your_ovh_sharepoint',
    QC:
      'https://www.ovh.com/ca/fr/g2249.activation_et_gestion_de_votre_sharepoint_ovh',
    US: 'https://www.ovh.com/us/g2249.enable_and_manage_your_ovh_sharepoint',
  })
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'sharepoint/renew/update/sharepoint-renew-update.html',
        renewUpdateTpl,
      );
      $templateCache.put(
        'sharepoint/activate/sharepoint-activate.html',
        activateTpl,
      );
      $templateCache.put(
        'sharepoint/admin-rights/reset/sharepoint-admin-rights-reset.html',
        adminRightsResetTpl,
      );
      $templateCache.put(
        'sharepoint/account/password/update/sharepoint-account-password-update.html',
        passwordUpdateTpl,
      );
      $templateCache.put(
        'sharepoint/account/update/sharepoint-account-update.html',
        accountUpdateTpl,
      );
      $templateCache.put(
        'sharepoint/account/delete/sharepoint-account-delete.html',
        accountDeleteTpl,
      );
      $templateCache.put('sharepoint/account/popover/user.html', userTpl);
      $templateCache.put(
        'sharepoint/account/add/sharepoint-account-add.html',
        accountAddTpl,
      );
      $templateCache.put(
        'sharepoint/account/add-legacy/sharepoint-account-add-legacy.html',
        accountAddLegacyTpl,
      );
      $templateCache.put(
        'sharepoint/domain/delete/sharepoint-domain-delete.html',
        domainDeleteTpl,
      );
      $templateCache.put(
        'sharepoint/domain/add/sharepoint-domain-add.html',
        domainAddTpl,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
