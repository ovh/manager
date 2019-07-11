import angular from 'angular';

import routing from './sharepoint.routes';
import sharepointCtrl from './sharepoint.controller';
import tabsCtrl from './sharepoint-tabs.controller';
import licenseService from './sharepoint.service';
import orderService from './sharepoint-order.service';

const moduleName = 'Module.sharepoint';

angular.module('Module.sharepoint.controllers', [])
  .controller('SharepointCtrl', sharepointCtrl)
  .controller('SharepointTabsCtrl', tabsCtrl);

angular.module('Module.sharepoint.services', [])
  .service('MicrosoftSharepointLicenseService', licenseService)
  .service('MicrosoftSharepointOrderService', orderService);

angular.module(moduleName, [
  'ovh-utils-angular',
  'ngRoute',
  'ui.bootstrap',
  'ngSanitize',
  'Module.sharepoint.controllers',
  'Module.sharepoint.services',
  'ovh-api-services',
]).config(routing)
  .constant('SHAREPOINT_GUIDE_URLS', {
    CZ: '',
    DE: 'https://www.ovh.de/g2249.aktivierung_und_verwaltung_ihres_ovh_sharepoint',
    ES: 'https://www.ovh.es/g2249.activacion_y_gestion_de_un_sharepoint_ovh',
    FI: 'https://www.ovh-hosting.fi/g2249.ovhn_sharepoint-hallintaliittyman_aktivointi',
    FR: 'https://docs.ovh.com/fr/fr/web/microsoft-collaborative-solutions/activation-et-gestion-de-votre-sharepoint-ovh/',
    GB: 'https://www.ovh.co.uk/g2249.enable_and_manage_your_ovh_sharepoint',
    IT: '',
    LT: 'https://www.ovh.lt/g2249.ovh_sharepoint_ijungimas_ir_valdymas',
    NL: '',
    PL: 'https://www.ovh.pl/g2249.aktywacja_uslugi_sharepoint_ovh_i_zarzadzanie_nia',
    PT: 'https://www.ovh.pt/g2249.ativacao_e_gestao_do_seu_sharepoint_ovh',
    CA: 'https://www.ovh.com/ca/en/g2249.enable_and_manage_your_ovh_sharepoint',
    QC: 'https://www.ovh.com/ca/fr/g2249.activation_et_gestion_de_votre_sharepoint_ovh',
    US: 'https://www.ovh.com/us/g2249.enable_and_manage_your_ovh_sharepoint',
  });

export default moduleName;
