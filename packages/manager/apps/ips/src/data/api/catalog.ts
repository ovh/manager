import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { CurrencyCode, OvhSubsidiary } from '@ovh-ux/manager-react-components';

export type CatalogIpPlan = {
  addonsFamily: unknown[];
  consumptionBillingStrategy: string | null;
  details: {
    metadatas: { key: string; value: 'true' | 'false' }[];
    pricings: {
      default: [
        {
          capacities: ('installation' | 'renew')[];
          commitment: number;
          description: string;
          interval: number;
          intervalUnit: string;
          maximumQuantity: number;
          maximumRepeat: number;
          minimumQuantity: number;
          minimumRepeat: number;
          mustBeCompleted: boolean;
          price: { currencyCode: CurrencyCode; text: string; value: number };
          priceCapInUcents: number | null;
          priceInUcents: number;
          pricingStrategy: string;
        },
      ];
    };
    product: {
      configurations: {
        defaultValue: string | null;
        isCustom: boolean;
        isMandatory: boolean;
        name: string;
        values: string[];
      }[];
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
