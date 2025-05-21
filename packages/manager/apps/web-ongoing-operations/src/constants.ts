import { z } from 'zod';

export const taskMeDomain = ['me', 'task', 'domain'];
export const taskMeDns = ['me', 'task', 'dns'];
export const taskMeAllDom = ['me', 'task', 'allDom'];

export enum DomainOperationsEnum {
  ContactControlAcknowledge = 'ContactControlAcknowledge',
  ContactControlCorrect = 'ContactControlCorrect',
  ContactControlNotify = 'ContactControlNotify',
  ContactControl = 'ContactControl',
  DomainContactControl = 'DomainContactControl',
  DomainContactUpdate = 'DomainContactUpdate',
  DomainTrade = 'DomainTrade',
  DomainEmailRedirectionsCreate = 'DomainEmailRedirectionsCreate',
  DomainEmailRedirectionsDelete = 'DomainEmailRedirectionsDelete',
  DomainDnsUpdate = 'DomainDnsUpdate',
  DomainDsUpdate = 'DomainDsUpdate',
  DomainHostCreate = 'DomainHostCreate',
  DomainHostDelete = 'DomainHostDelete',
  DomainHostUpdate = 'DomainHostUpdate',
  DomainAfterMarket = 'DomainAfterMarket',
  DomainCreate = 'DomainCreate',
  DomainHold = 'DomainHold',
  DomainUnhold = 'DomainUnhold',
  DomainIncomingTransfer = 'DomainIncomingTransfer',
  DomainOutgoingTransfer = 'DomainOutgoingTransfer',
  DomainLock = 'DomainLock',
  DomainUnlock = 'DomainUnlock',
  DomainRenew = 'DomainRenew',
  DomainRestore = 'DomainRestore',
  DomainDelete = 'DomainDelete',
  DomainResourceDelete = 'DomainResourceDelete',
  DomainRegistryDelete = 'DomainRegistryDelete',
}

export const DomainOperations = [
  DomainOperationsEnum.ContactControlAcknowledge,
  DomainOperationsEnum.ContactControlCorrect,
  DomainOperationsEnum.ContactControlNotify,
  DomainOperationsEnum.ContactControl,
  DomainOperationsEnum.DomainContactControl,
  DomainOperationsEnum.DomainContactUpdate,
  DomainOperationsEnum.DomainTrade,
  DomainOperationsEnum.DomainEmailRedirectionsCreate,
  DomainOperationsEnum.DomainEmailRedirectionsDelete,
  DomainOperationsEnum.DomainDnsUpdate,
  DomainOperationsEnum.DomainDsUpdate,
  DomainOperationsEnum.DomainHostCreate,
  DomainOperationsEnum.DomainHostDelete,
  DomainOperationsEnum.DomainHostUpdate,
  DomainOperationsEnum.DomainAfterMarket,
  DomainOperationsEnum.DomainCreate,
  DomainOperationsEnum.DomainHold,
  DomainOperationsEnum.DomainUnhold,
  DomainOperationsEnum.DomainIncomingTransfer,
  DomainOperationsEnum.DomainOutgoingTransfer,
  DomainOperationsEnum.DomainLock,
  DomainOperationsEnum.DomainUnlock,
  DomainOperationsEnum.DomainRenew,
  DomainOperationsEnum.DomainRestore,
  DomainOperationsEnum.DomainDelete,
  DomainOperationsEnum.DomainResourceDelete,
  DomainOperationsEnum.DomainRegistryDelete,
];

export enum DNSOperationsEnum {
  DnsAnycastActivate = 'DnsAnycastActivate',
  DnsAnycastDeactivate = 'DnsAnycastDeactivate',
  DnssecDisable = 'DnssecDisable',
  DnssecEnable = 'DnssecEnable',
  DnssecResigning = 'DnssecResigning',
  DnssecRollKsk = 'DnssecRollKsk',
  DnssecRollZsk = 'DnssecRollZsk',
  ZoneCreate = 'ZoneCreate',
  ZoneCut = 'ZoneCut',
  ZoneDelete = 'ZoneDelete',
  ZoneImport = 'ZoneImport',
  ZoneRestore = 'ZoneRestore',
}

export const DNSOperations = [
  DNSOperationsEnum.DnsAnycastActivate,
  DNSOperationsEnum.DnsAnycastDeactivate,
  DNSOperationsEnum.DnssecDisable,
  DNSOperationsEnum.DnssecEnable,
  DNSOperationsEnum.DnssecResigning,
  DNSOperationsEnum.DnssecRollKsk,
  DNSOperationsEnum.DnssecRollZsk,
  DNSOperationsEnum.ZoneCreate,
  DNSOperationsEnum.ZoneCut,
  DNSOperationsEnum.ZoneDelete,
  DNSOperationsEnum.ZoneImport,
  DNSOperationsEnum.ZoneRestore,
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
