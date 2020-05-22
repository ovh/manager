import generalInformationsState from './general-informations/domain-general-informations.state';
import generalInformationService from './general-informations/general-information.service';

import anycast from './anycast';
import emailObfuscation from './email-obfuscation/index';
import optin from './optin/index';
import webhosting from './webhosting';
import webhostingDetach from './general-informations/free-webhosting-detach';
import webhostingEnable from './general-informations/webhosting-enable/enable.module';
import zoneActivation from './general-informations/activateZone/activate.module';

import dnsZone from '../dns-zone';

import routing from './domain.routing';

const moduleName = 'ovhManagerWebDomainModule';

angular
  .module(moduleName, [
    anycast,
    dnsZone,
    emailObfuscation,
    optin,
    webhosting,
    webhostingDetach,
    webhostingEnable,
    zoneActivation,
  ])
  .config(routing)
  .config(generalInformationsState)
  .service('DomainGeneralInformation', generalInformationService);

export default moduleName;
