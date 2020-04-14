import generalInformationsState from './general-informations/domain-general-informations.state';

import anycast from './anycast';
import anycastTerminate from './anycast/terminate';
import confirmAnycastTerminate from './anycast/terminate/confirm';
import emailObfuscation from './email-obfuscation/index';
import optin from './optin/index';
import webhosting from './webhosting';
import zoneActivation from './general-informations/activateZone/activate.module';

import routing from './domain.routing';

const moduleName = 'ovhManagerWebDomainModule';

angular
  .module(moduleName, [
    anycast,
    anycastTerminate,
    confirmAnycastTerminate,
    emailObfuscation,
    optin,
    webhosting,
    zoneActivation,
  ])
  .config(routing)
  .config(generalInformationsState);

export default moduleName;
