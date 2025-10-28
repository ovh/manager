export type ServiceInfosType = {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo: string;
  expiration: string;
  possibleRenewPeriod: [0];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: number;
  };
  renewalType: string;
  serviceId: number;
  status: string;
};

export enum DnssecState {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  NOT_SUPPORTED = 'not_supported',
}

export enum NameServerType {
  ANYCAST = 'anycast',
  DEDICATED = 'dedicated',
  EMPTY = 'empty',
  EXTERNAL = 'external',
  HOLD = 'hold',
  HOSTED = 'hosted',
  HOSTING = 'hosting',
  MIXED = 'mixed',
  PARKING = 'parking',
}

export enum DomainOffer {
  DIAMOND = 'diamond',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum DomainState {
  EXPIRED = 'expired',
  RESTORABLE = 'restorable',
  DELETED = 'deleted',
  PENDING_DELETE = 'pending_delete',
  OUTGOING_TRANSFER = 'outgoing_transfer',
  DISPUTE = 'dispute',
  OK = 'ok',
}

export enum SuspensionState {
  NOT_SUSPENDED = 'not_suspended',
  SUSPENDED = 'suspended',
}

export enum TransferLockStatus {
  LOCKED = 'locked',
  LOCKING = 'locking',
  UNAVAILABLE = 'unavailable',
  UNLOCKED = 'unlocked',
  UNLOCKING = 'unlocking',
}

export type DomainServiceType = {
  contactAdmin: {
    id: string;
  };
  contactBilling: {
    id: string;
  };
  contactOwner: {
    id: string;
  };
  contactTech: {
    id: string;
  };
  dnssecState: DnssecState;
  dnssecSupported: boolean;
  domain: string;
  expirationDate: string;
  glueRecordIpv6Supported: boolean;
  glueRecordMultiIpSupported: boolean;
  hostSupported: boolean;
  iam: {
    displayName: string;
    id: string;
    tags: {
      'any-key': string;
    };
    urn: string;
  };
  lastUpdate: string;
  nameServerType: NameServerType;
  nameServers: [
    {
      id: number;
      ipv4: string;
      ipv6: string;
      nameServer: string;
      nameServerType: NameServerType;
    },
  ];
  offer: DomainOffer;
  owoSupported: boolean;
  parentService: {
    name: string;
    type: '/allDom';
  };
  renewalDate: string;
  renewalState: string;
  serviceId: number;
  state: DomainState;
  suspensionState: SuspensionState;
  transferLockStatus: TransferLockStatus;
  whoisOwner: string;
};

export type EmailOptionType = {
  id: number;
  domain: string;
  creationDate: string;
};
