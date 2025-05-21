import { z } from 'zod';

export const taskMeDomain = ['me', 'task', 'domain'];
export const taskMeDns = ['me', 'task', 'dns'];
export const taskMeAllDom = ['me', 'task', 'allDom'];

export const domainCreate = 'DomainCreate';
export const domainIncomingTransfer = 'DomainIncomingTransfer';
export const domainResourceDelete = 'DomainResourceDelete';
export const domainDnsUpdate = 'DomainDnsUpdate';

export const DOMAIN_OPERATIONS = [
  'ContactControlAcknowledge',
  'ContactControlCorrect',
  'ContactControlNotify',
  'ContactControl',
  'DomainContactControl',
  'DomainContactUpdate',
  'DomainTrade',
  'DomainEmailRedirectionsCreate',
  'DomainEmailRedirectionsDelete',
  'DomainSendRDRPNotice',
  'DomainDnsUpdate',
  'DomainDsUpdate',
  'DomainHostCreate',
  'DomainHostDelete',
  'DomainHostUpdate',
  'DomainAfterMarket',
  'DomainCreate',
  'DomainHold',
  'DomainUnhold',
  'DomainIncomingTransfer',
  'DomainOutgoingTransfer',
  'DomainLock',
  'DomainUnlock',
  'DomainRenew',
  'DomainRestore',
  'DomainDelete',
  'DomainResourceDelete',
  'DomainRegistryDelete',
];

export const DNS_OPERATIONS = [
  'DnsAnycastActivate',
  'DnsAnycastDeactivate',
  'DnssecDisable',
  'DnssecEnable',
  'DnssecResigning',
  'DnssecRollKsk',
  'DnssecRollZsk',
  'ZoneCreate',
  'ZoneCut',
  'ZoneDelete',
  'ZoneImport',
  'ZoneRestore',
];
export const editableArgument: Record<string, z.ZodString> = {
  authInfo: z
    .string()
    .min(5)
    .max(50),
  legitimacyAfnic: z.string(),
  processId: z
    .string()
    .min(5)
    .max(20),
  NIF: z.string().min(5),
  ownerLegalName: z.string(),
  identificationNumber: z.string().min(5),
  firstname: z.string(),
  name: z.string(),
  action: z.string(),
  memberContactXXX: z.string(),
  ukLegalForm: z.string(),
  UIN: z.string(),
  validationToken: z.string(),
  default: z.string(),
};
