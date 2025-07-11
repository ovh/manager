import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { CurrencyCode, OvhSubsidiary } from '@ovh-ux/manager-react-components';

export type Capacity =
  | 'installation'
  | 'renew'
  | 'consumption'
  | 'detach'
  | 'downgrade'
  | 'dynamic'
  | 'upgrade';

export type Pricing = {
  capacities: Capacity[];
  commitment?: number;
  description: string;
  interval: number;
  intervalUnit?: string;
  maximumQuantity?: number | null;
  maximumRepeat?: number | null;
  minimumQuantity: number;
  minimumRepeat: number;
  mustBeCompleted?: boolean;
  price: { currencyCode: CurrencyCode; text: string; value: number };
  priceCapInUcents?: number | null;
  priceInUcents: number;
  pricingStrategy?: string;
  duration?: string;
};

export type CatalogIpConfiguration = {
  defaultValue: string | null;
  isCustom: boolean;
  isMandatory: boolean;
  name: string;
  values: string[];
};

export type CatalogIpPlan = {
  addonsFamily: unknown[];
  consumptionBillingStrategy: string | null;
  details: {
    metadatas: { key: string; value: 'true' | 'false' }[];
    pricings: {
      default: Pricing[];
    };
    product: {
      configurations: CatalogIpConfiguration[];
      description: string;
      internalType:
        | 'cloud_service'
        | 'delivery'
        | 'deposit'
        | 'domain'
        | 'implementation_services'
        | 'saas_license'
        | 'shipping'
        | 'storage';
      name: string;
    };
  };
  familyName?: string | null;
  invoiceName: string;
  planCode: string;
  pricingType: 'rental' | 'consumption';
};

export type CatalogIpsResponse = {
  catalogId: number;
  merchantCode: OvhSubsidiary;
  plans: CatalogIpPlan[];
};

export const getCatalogIps = (
  sub: OvhSubsidiary = OvhSubsidiary.FR,
): Promise<ApiResponse<CatalogIpsResponse>> =>
  apiClient.v6.get(`/order/catalog/formatted/ip?ovhSubsidiary=${sub}`);

export type PccCatalogPlan = {
  productType: string;
  productName: string;
  family:
    | 'backup'
    | 'ip'
    | 'datastore'
    | 'dr'
    | 'environnement'
    | 'host'
    | 'management'
    | 'security'
    | 'network';
  prices: (Pricing & { pricingMode: string; pricingType: string })[];
  planCode: string;
  exclusive: boolean;
  mandatory: boolean;
};

export type PccCatalogResponse = PccCatalogPlan[];

export const getPccCatalog = (
  serviceName: string,
): Promise<ApiResponse<PccCatalogResponse>> =>
  apiClient.v6.get(`/order/cartServiceOption/privateCloud/${serviceName}`);
