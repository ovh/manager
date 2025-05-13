import ovhManagerAdvices from '@ovh-ux/manager-advices';

import generalInformationsState from '../general-informations/domain-general-informations.state';

import dnsZone from '../../dns-zone';
import historyModule from '../../dns-zone/history/history.module';
import anycast from '../anycast';
import domainDnsModify from '../dns-modify/domain-dns-modify.module';
import domainDns from '../dns/domain-dns.module';
import contact from '../contact/contact.module';
import dnssec from '../dnssec/dnssec.module';
import dynhost from '../dynhost/dynhost.module';
import emailObfuscation from '../email-obfuscation/index';
import zoneActivation from '../general-informations/activateZone/activate.module';
import webhostingEnable from '../general-informations/webhosting-enable/enable.module';
import glue from '../glue/glue.module';
import optin from '../optin/index';
import redirection from '../redirection/redirection.module';
import tasks from '../tasks/tasks.module';
import webhosting from '../webhosting';

import routing from './domain.routing';

const moduleName = 'ovhManagerWebDomainModule';

angular
  .module(moduleName, [
    anycast,
    contact,
    domainDns,
    dnssec,
    dnsZone,
    dynhost,
    domainDnsModify,
    emailObfuscation,
    glue,
    optin,
    ovhManagerAdvices,
    redirection,
    tasks,
    webhosting,
    webhostingEnable,
    zoneActivation,
    historyModule,
  ])
  .config(routing)
  .config(generalInformationsState)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
