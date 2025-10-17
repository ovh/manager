import { Country, UserLocales } from '@ovh-ux/manager-config';
import {
  BillingCapacitiesEnum,
  BillingTypeEnum,
  LegalFormEnum,
  LifecycleCapacitiesEnum,
  PrincingTypeEnum,
  ServiceInfoRenewModeEnum,
} from '@/common/enum/common.enum';
import {
  ActionsEnum,
  CapacitiesEnum,
  ContactTypeEnum,
  CurrencyCodeEnum,
  DefaultEndActionEnum,
  EngagementConfigurationTypeEnum,
  ModeEnum,
  PossibleStrategiesEnum,
  PricingTypeEnum,
  ResellingProviderEnum,
  ResourceStateEnum,
  StateEnum,
} from '../enum/option.enum';

export interface TServiceInfo {
  serviceId: number;
  billing: {
    expirationDate: string | null;
    renew?: {
      current: {
        mode: ServiceInfoRenewModeEnum | null;
        nextDate: string;
        period: string;
      };
    } | null;
    lifecycle?: {
      current: {
        creationDate: string | null;
        pendingActions: LifecycleCapacitiesEnum[];
      };
    } | null;
    pricing?: {
      capacities: BillingCapacitiesEnum;
      description: string;
      duration: string;
      engagementConfiguration: {
        defaultEndAction: DefaultEndActionEnum;
        duration: string;
        type: BillingTypeEnum;
        interval: number;
        maximumQuantity?: number | null;
        maximumRepeat?: number | null;
        minimumQuantity: number;
        minimumRepeat: number;
      };
      price: {
        currencyCode: CurrencyCodeEnum;
        priceInUcents?: number | null;
        text: string;
        value: number;
      };
      priceInUcents: number;
      pricingMode: string;
      pricingType: PrincingTypeEnum;
    };
  };
  customer?: {
    contacts: {
      customerCode: string;
      type: string;
    }[];
  };
  resource: {
    name: string;
  };
}

export interface TServiceOption {
  billing: TBilling;
  customer: TCustomer;
  parentServiceId: number | null;
  resource: TResource;
  route: {
    path: string;
    url: string;
    vars: {
      [key: string]: string;
    }[];
  } | null;
  serviceId: number;
  tags: string[];
}

interface TResource {
  displayName: string;
  name: string;
  product: {
    description: string;
    name: string;
  };
  resellingProvider: ResellingProviderEnum;
  state: ResourceStateEnum;
}

interface TCustomer {
  contacts: {
    customerCode: string;
    type: ContactTypeEnum;
  };
}

interface TBilling {
  engagement: TEngagement;
  engagementRequest: TEngagementRequest;
  expirationDate: string;
  group: {
    id: number;
  };
  lifecycle: TLifecyle;
  nextBillingDate: string;
  plan: {
    code: string;
    invoiceName: string;
  };
  princing: TPricing;
  renew: {
    capacities: {
      mode: ModeEnum[];
    };
    current: {
      mode: ModeEnum;
      nextDate: string | null;
      period: string | null;
    };
  };
}

interface TEngagement {
  endDate: string;
  endRule: {
    possibleStrategies: PossibleStrategiesEnum;
    strategy: PossibleStrategiesEnum[];
  };
}

interface TEngagementRequest {
  princingMode: string;
  requestDate: string;
}

interface TLifecyle {
  capacities: {
    actions: ActionsEnum[];
  };
  current: {
    creationDate: string;
    pendingActions: ActionsEnum[];
    state: StateEnum;
    terminationDate: string;
  };
}

interface TPricing {
  capacities: CapacitiesEnum;
  description: string;
  duration: string;
  engagementConfiguration: {
    defaultEndAction: DefaultEndActionEnum;
    duration: string;
    type: EngagementConfigurationTypeEnum;
  };
  interval: number;
  maximumQuantity: number | null;
  maximumRepeat: number | null;
  minimumQuantity: number;
  minimumRepeat: number;
  price: {
    currencyCode: CurrencyCodeEnum;
    priceInUcents: number;
    text: string;
    value: number;
  };
  priceInUcents: number;
  pricingMode: string;
  pricingType: PricingTypeEnum;
}

export interface TDomainContact {
  accreditationCountry?: Country;
  accreditationId?: string | null;
  accreditationOrganism?: string | null;
  accreditationYear?: number | null;
  address?: TContactAdress | null;
  birthCity?: string | null;
  birthCountry?: Country | null;
  birthDay?: string | null;
  birthZip?: string | null;
  cellPhone?: string | null;
  companyNationalIdentificationNumber?: string | null;
  email?: string | null;
  enterpriseId?: string | null;
  fax?: string | null;
  firstName?: string | null;
  id: number;
  insee?: string | null;
  language?: UserLocales | null;
  lastName?: string | null;
  legalForm?: LegalFormEnum | null;
  legalFormCategory?: string | null;
  nationalIdentificationNumber?: string | null;
  nationality?: Country | null;
  organisationAccountable?: string | null;
  organisationFunding?: string | null;
  organisationFundingOther?: string | null;
  organisationName?: string | null;
  organisationRole?: string | null;
  organisationRoleOther?: string | null;
  organisationStaffStatus?: string | null;
  organisationStaffStatusOther?: string | null;
  organisationType?: string | null;
  organisationTypeOther?: string | null;
  phone?: string | null;
  registrantDocumentType?: string | null;
  registrantDocumentTypeOther?: string | null;
  roleInOrganisation?: string | null;
  trademarkId?: string | null;
  vat?: string | null;
  website?: string | null;
}

export interface TContactAdress {
  city: string;
  country: Country;
  line1: string;
  line2?: string;
  line3?: string;
  otherDetails?: string;
  province: string;
  zip: string;
}
