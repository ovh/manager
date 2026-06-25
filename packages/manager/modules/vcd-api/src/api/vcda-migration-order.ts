import {
  createCart,
  postOrderCartCartIdCheckout,
} from '@ovh-ux/manager-module-order';
import { VCDOrganization } from '../types';

export const VCDA_ORDER = {
  PLAN_CODE: 'vcda-migration',
  PRODUCT_FAMILY: 'vcdaMigration',
  PRICING_MODE: 'default',
  DURATION: 'P1M',
  QUANTITY: 1,
} as const;

export const VCDA_ORDER_CONFIG_LABEL = {
  ORG_ID: 'org-id',
  EXTERNAL_IPS: 'external-ips',
  DATACENTER_ZONE: 'datacenter-zone',
} as const;

export interface OrderVcdaConfig {
  orgId: string;
  externalIp: string;
  datacenterZone: string;
}

export type SubmitVcdaOrderParams = {
  ovhSubsidiary: string;
  config: OrderVcdaConfig;
};

export type VcdaContract = {
  name: string;
  url: string;
  content?: string;
};

export type PreparedVcdaOrder = {
  cartId: string;
  contractList: VcdaContract[];
};

export const getVcdaDatacenterZone = (organization?: VCDOrganization): string =>
  organization?.currentState?.region?.toLowerCase() ?? '';

export const prepareVcdaOrder = async ({
  ovhSubsidiary,
  config,
}: SubmitVcdaOrderParams): Promise<PreparedVcdaOrder> => {
  const { cartId, contractList } = await createCart({
    ovhSubsidiary,
    items: [
      {
        itemEndpoint: VCDA_ORDER.PRODUCT_FAMILY,
        options: {
          planCode: VCDA_ORDER.PLAN_CODE,
          pricingMode: VCDA_ORDER.PRICING_MODE,
          duration: VCDA_ORDER.DURATION,
          quantity: VCDA_ORDER.QUANTITY,
        },
        configurations: [
          { label: VCDA_ORDER_CONFIG_LABEL.ORG_ID, value: config.orgId },
          {
            label: VCDA_ORDER_CONFIG_LABEL.EXTERNAL_IPS,
            value: config.externalIp,
          },
          {
            label: VCDA_ORDER_CONFIG_LABEL.DATACENTER_ZONE,
            value: config.datacenterZone,
          },
        ],
      },
    ],
  });

  return { cartId, contractList: contractList ?? [] };
};

export const checkoutVcdaOrder = async (cartId: string) => {
  const { data } = await postOrderCartCartIdCheckout({
    cartId,
    autoPayWithPreferredPaymentMethod: true,
    waiveRetractationPeriod: true,
  });

  return data;
};
