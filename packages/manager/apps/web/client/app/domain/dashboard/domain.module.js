import ovhManagerAdvices from '@ovh-ux/manager-advices';
import generalInformationsState from '../general-informations/domain-general-informations.state';

import anycast from '../anycast';
import dns from '../dns/dns.module';
import emailObfuscation from '../email-obfuscation/index';
import optin from '../optin/index';
import redirection from '../redirection/redirection.module';
import webhosting from '../webhosting';
import webhostingEnable from '../general-informations/webhosting-enable/enable.module';
import zoneActivation from '../general-informations/activateZone/activate.module';

import dnsZone from '../../dns-zone';

import routing from './domain.routing';

const moduleName = 'ovhManagerWebDomainModule';

angular
  .module(moduleName, [
    anycast,
    dns,
    dnsZone,
    emailObfuscation,
    optin,
    ovhManagerAdvices,
    redirection,
    webhosting,
    webhostingEnable,
    zoneActivation,
  ])
  .config(routing)
  .config(generalInformationsState)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
