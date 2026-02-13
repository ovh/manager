export const urls = {
  domainRoot: '/domain',
  domainOnboarding: '/domain/onboarding',
  domainDetail: '/domain/:serviceName',
  domainTabInformation: '/domain/:serviceName/information',
  domainTabZone: '/domain/:serviceName/zone',
  domainTabDns: '/domain/:serviceName/dns',
  domainTabOrderAnycast: '/domain/:serviceName/anycast/order',
  domainTabWebHostingOrder: '/domain/:serviceName/webhosting/order',
  domainTabDnsModify: '/domain/:serviceName/dns-modify',
  domainTabRedirection: '/domain/:serviceName/redirection',
  domainTabDynHost: '/domain/:serviceName/dynhost',
  domainTabHost: '/domain/:serviceName/hosts',
  domainTabHostDelete: '/domain/:serviceName/hosts/:hostname/delete',
  domainTabDnssec: '/domain/:serviceName/dnssec',
  domainTabDsrecords: '/domain/:serviceName/ds-records',
  domainTabContactManagement: '/domain/:serviceName/contact-management',
  // zone routes
  zoneRoot: "/domain/:serviceName/zone/zone",
  //activate zone
  zoneActivate: "/domain/:serviceName/zone/activate",
  //entry
  zoneAddEntry: "/domain/:serviceName/zone/add-entry",
  zoneModifyEntry: "/domain/:serviceName/zone/modify-entry",
  zoneDeleteEntry: "/domain/:serviceName/zone/delete-entry",
  // modify 
  zoneModifyTextualRecord: "/domain/:serviceName/zone/modify-textual-record",
  zoneModifyTtlRecord: "/domain/:serviceName/zone/modify-ttl",
  // history 
  zoneHistory: "/domain/:serviceName/zone/history",
  // reset 
  zoneReset: "/domain/:serviceName/zone/reset",
  // delete 
  zoneDelete: "/domain/:serviceName/zone/delete",
};
