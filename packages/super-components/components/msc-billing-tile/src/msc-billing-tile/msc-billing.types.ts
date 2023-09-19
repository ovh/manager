export type Translations = {
  manager_billing_subscription: string;
  manager_billing_subscription_creation: string;
  manager_billing_subscription_next_due_date: string;
  manager_billing_subscription_engagement: string;
  manager_billing_subscription_engagement_status_none: string;
  manager_billing_subscription_contacts: string;
  manager_billing_subscription_contacts_admin: string;
  manager_billing_subscription_contacts_tech: string;
  manager_billing_subscription_contacts_billing: string;
  manager_billing_subscription_contacts_management: string;
  manager_billing_subscription_error: string;
  manager_billing_subscription_engagement_commit: string;
  manager_billing_subscription_engagement_commit_again: string;
  manager_billing_subscription_engagement_commit_with_discount: string;
  manager_billing_subscription_engagement_commit_again_with_discount: string;
  manager_billing_subscription_engagement_status_engaged: string;
  manager_billing_subscription_engagement_status_engaged_renew: string;
  manager_billing_subscription_engagement_status_engaged_expired: string;
  manager_billing_subscription_engagement_status_commitement_pending: string;
  manager_billing_subscription_offer: string;
  manager_billing_service_status: string;
  manager_billing_service_status_auto: string;
  manager_billing_service_status_automatic: string;
  manager_billing_service_status_manual: string;
  manager_billing_service_status_manualPayment: string;
  manager_billing_service_status_pending_debt: string;
  manager_billing_service_status_delete_at_expiration: string;
  manager_billing_service_status_expired: string;
  manager_billing_service_status_billing_suspended: string;
  manager_billing_service_status_forced_manual: string;
  billing_services_actions_menu_label: string;
  billing_autorenew_service_enable_autorenew: string;
  billing_services_actions_menu_pay_bill: string;
  billing_services_actions_menu_manage_renew: string;
  billing_services_actions_menu_exchange_update_accounts: string;
  billing_services_actions_menu_anticipate_renew: string;
  billing_services_actions_menu_resiliate: string;
  billing_services_actions_menu_resiliate_my_engagement: string;
  billing_services_actions_menu_renew_label: string;
  billing_services_actions_menu_renew: string;
  billing_services_actions_menu_exchange_update: string;
  billing_services_actions_menu_resiliate_EMAIL_DOMAIN: string;
  billing_services_actions_menu_resiliate_ENTERPRISE_CLOUD_DATABASE: string;
  billing_services_actions_menu_resiliate_HOSTING_WEB: string;
  billing_services_actions_menu_resiliate_HOSTING_PRIVATE_DATABASE: string;
  billing_services_actions_menu_resiliate_WEBCOACH: string;
  billing_services_actions_menu_sms_credit: string;
  billing_services_actions_menu_sms_renew: string;
  billing_services_actions_menu_resiliate_cancel: string;
  billing_services_actions_menu_see_dashboard: string;
  billing_services_actions_menu_commit: string;
  billing_services_actions_menu_commit_cancel: string;
  billing_services_actions_menu_change_owner: string;
  billing_services_actions_menu_configuration_update_owner: string;
  billing_services_domain_contact_owner: string;
  billing_services_actions_menu_change_offer: string;
};

export type Period = 1 | 3 | 6 | 12 | 24 | 36 | 48 | 60 | 72 | 84;

export enum RenewalStatus {
  DELETE_AT_EXPIRATION = 'deleteAtExpiration',
  AUTOMATIC = 'automatic',
  AUTO = 'auto',
  MANUAL = 'manualPayment',
  EXPIRED = 'expired',
  MANUAL_FORCED = 'forcedManual',
  BILLING_SUSPENDED = 'billingSuspended',
  UNKNOWN = 'unknown',
}

export type ServiceInfos = {
  serviceId: number;
  // date format yyyy-mm-dd
  expiration: string;
  canDeleteAtExpiration: boolean;
  renew: {
    period: Period;
    automatic: boolean;
    forced: boolean;
    manualPayment: boolean;
    deleteAtExpiration: boolean;
  };
  // date format yyyy-mm-dd
  engagedUpTo: string | null;
  domain: string;
  contactTech: string;
  status: 'expired' | 'inCreation' | 'ok' | 'pendingDebt' | 'unPaid';
  // date format yyyy-mm-dd
  creation: string;
  contactBilling: string;
  possibleRenewPeriod: Period[];
  renewalType:
    | 'automaticForcedProduct'
    | 'automaticV2012'
    | 'automaticV2014'
    | 'automaticV2016'
    | 'manual'
    | 'oneShot'
    | 'option';
  contactAdmin: string;
};

export type Language =
  | 'cs_CZ'
  | 'de_DE'
  | 'en_AU'
  | 'en_CA'
  | 'en_GB'
  | 'en_IE'
  | 'en_US'
  | 'es_ES'
  | 'fi_FI'
  | 'fr_CA'
  | 'fr_FR'
  | 'fr_MA'
  | 'fr_SN'
  | 'fr_TN'
  | 'it_IT'
  | 'lt_LT'
  | 'nl_NL'
  | 'pl_PL'
  | 'pt_PT';

export type ContactInfos = {
  address: {
    country: string;
    city: string;
    zip: string;
    line1: string;
    line2?: string;
    line3?: string;
    otherDetails?: string;
    province?: string;
  };
  birthCity?: string;
  birthCountry?: string;
  // Date
  birthDay?: string;
  birthZip?: string;
  firstName: string;
  // Contact id
  id: number;
  language: Language;
  lastName: string;
  legalForm:
    | 'administration'
    | 'association'
    | 'corporation'
    | 'individual'
    | 'other'
    | 'personalcorporation';
  phone: string;
  cellPhone?: string;
  fax?: string;
  gender?: 'male' | 'female';
  companyNationalIdentificationNumber?: string;
  nationalIdentificationNumber?: string;
  nationality?: string;
  organisationName?: string;
  organisationType?: string;
  spareEmail?: string;
  vat?: string;
};
export type Strategy =
  | 'CANCEL_SERVICE'
  | 'REACTIVATE_ENGAGEMENT'
  | 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE'
  | 'STOP_ENGAGEMENT_KEEP_PRICE';

export type CurrencyCode =
  | 'AUD'
  | 'CAD'
  | 'CZK'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'LTL'
  | 'MAD'
  | 'N/A'
  | 'PLN'
  | 'SGD'
  | 'TND'
  | 'USD'
  | 'XOF'
  | 'points';

export type LifecycleAction =
  | 'earlyRenewal'
  | 'terminate'
  | 'terminateAtEngagementDate'
  | 'terminateAtExpirationDate';

export type ServiceDetails = {
  billing: {
    // Datetime format
    nextBillingDate: string;
    // Datetime format
    expirationDate?: string;
    plan: {
      code?: string;
      invoiceName?: string;
    };
    pricing: {
      capacities: (
        | 'consumption'
        | 'detach'
        | 'downgrade'
        | 'dynamic'
        | 'installation'
        | 'renew'
        | 'upgrade'
      )[];
      description?: string;
      interval: number;
      duration?: string;
      minimumQuantity?: number;
      maximumQuantity?: number;
      minimumRepeat?: number;
      maximumRepeat?: number;
      price?: {
        currencyCode?: CurrencyCode;
        text?: string;
        value?: number;
      };
      priceInUcents?: number;
      pricingMode: string;
      pricingType: 'consumption' | 'purchase' | 'rental';
      engagementConfiguration?: {
        defaultEndAction: Strategy;
        duration?: string;
        type?: 'periodic' | 'upfront';
      };
    };
    group: { id: number } | null;
    lifecycle: {
      current: {
        pendingActions: LifecycleAction[];
        // Datetime format
        terminationDate?: string | null;
        // Datetime format
        creationDate?: string;
        state:
          | 'active'
          | 'error'
          | 'rupture'
          | 'terminated'
          | 'toRenew'
          | 'unpaid'
          | 'unrenewed';
      };
      capacities: {
        actions: LifecycleAction[];
      };
    };
    renew: {
      current: {
        mode: 'automatic' | 'manual';
        // Datetime format
        nextDate: string;
        period: Period;
      };
      capacities: {
        mode: ('automatic' | 'manual')[];
      };
    };
    engagement?: {
      endDate?: string;
      endRule?: { possibleStrategies: Strategy[]; strategy?: Strategy };
    };
    engagementRequest?: { requestDate?: string; pricingMode?: string };
  };
  customer: {
    contacts: {
      customerCode: string;
      type: 'administrator' | 'billing' | 'technical';
    }[];
  };
  route?: {
    path: string;
    url: string;
    vars: {
      key: string;
      value: string;
    }[];
  };
  ressource?: {
    displayName: string;
    name: string;
    state:
      | 'active'
      | 'deleted'
      | 'suspended'
      | 'toActivate'
      | 'toDelete'
      | 'toSuspend';
    product: {
      name: string;
      description: string;
    };
    resellingProvider?: 'ovh.ca' | 'ovh.eu' | null;
  };
  parentServiceId?: number;
  serviceId?: number;
  tags?: string[];
};

export type DomainProperties = {
  parentService: null | { name: string; type: '/allDom' }[];
  dnssecSupported: boolean;
  hostSupported: boolean;
  // Datetime
  lastUpdate: string;
  whoisOwner: string;
  suspensionState?: 'not_suspended' | 'suspended';
  glueRecordIpv6Supported: boolean;
  // Service name
  domain: string;
  glueRecordMultiIpSupported: boolean;
  transferLockStatus:
    | 'locked'
    | 'locking'
    | 'unavailable'
    | 'unlocked'
    | 'unlocking';
  owoSupported: boolean;
  nameServerType: 'hosted' | 'external';
  offer: 'diamond' | 'gold' | 'platinum';
  state:
    | 'deleted'
    | 'dispute'
    | 'expired'
    | 'ok'
    | 'outgoing_transfer'
    | 'pending_delete'
    | 'pending_installation'
    | 'restorable';
};

export type ServiceProperties = {
  offer?: string;
};
