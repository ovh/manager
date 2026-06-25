import { describe, expect, it, vi, beforeEach } from 'vitest';
import { VCDOrganization ,
  checkoutVcdaOrder,
  getVcdaDatacenterZone,
  prepareVcdaOrder,
  VCDA_ORDER,
  VCDA_ORDER_CONFIG_LABEL,
} from '@ovh-ux/manager-module-vcd-api';
import {
  createCart,
  postOrderCartCartIdCheckout,
} from '@ovh-ux/manager-module-order';

vi.mock('@ovh-ux/manager-module-order', () => ({
  createCart: vi.fn(),
  postOrderCartCartIdCheckout: vi.fn(),
}));

const makeOrg = (region: string) =>
  (({ currentState: { region } } as unknown) as VCDOrganization);

describe('getVcdaDatacenterZone', () => {
  it('returns the BARE lowercased region with no -a suffix (R11)', () => {
    expect(getVcdaDatacenterZone(makeOrg('EU-WEST-RBX'))).toBe('eu-west-rbx');
  });

  it('does NOT append the Veeam availability-zone -a suffix', () => {
    expect(getVcdaDatacenterZone(makeOrg('CA-EAST-BHS'))).not.toMatch(/-a$/);
  });

  it('returns an empty string when the organisation is missing', () => {
    expect(getVcdaDatacenterZone(undefined)).toBe('');
  });
});

describe('prepareVcdaOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createCart).mockResolvedValue({
      cartId: 'cart-123',
      contractList: [{ name: 'Contract A', url: 'http://c/a.pdf' }],
    });
  });

  it('creates the vcdaMigration cart item with the 3 config labels and returns the contracts; NO checkout', async () => {
    const result = await prepareVcdaOrder({
      ovhSubsidiary: 'FR',
      config: {
        orgId: 'org-1',
        externalIp: '1.2.3.4/32',
        datacenterZone: 'eu-west-rbx',
      },
    });

    expect(createCart).toHaveBeenCalledTimes(1);
    const cartArg = vi.mocked(createCart).mock.calls[0][0];
    expect(cartArg.ovhSubsidiary).toBe('FR');

    const [item] = cartArg.items;
    expect(item.itemEndpoint).toBe(VCDA_ORDER.PRODUCT_FAMILY);
    expect(item.options).toMatchObject({
      planCode: VCDA_ORDER.PLAN_CODE,
      pricingMode: VCDA_ORDER.PRICING_MODE,
      duration: VCDA_ORDER.DURATION,
      quantity: VCDA_ORDER.QUANTITY,
    });
    expect(item.configurations).toEqual([
      { label: VCDA_ORDER_CONFIG_LABEL.ORG_ID, value: 'org-1' },
      { label: VCDA_ORDER_CONFIG_LABEL.EXTERNAL_IPS, value: '1.2.3.4/32' },
      { label: VCDA_ORDER_CONFIG_LABEL.DATACENTER_ZONE, value: 'eu-west-rbx' },
    ]);
    expect(result).toEqual({
      cartId: 'cart-123',
      contractList: [{ name: 'Contract A', url: 'http://c/a.pdf' }],
    });
    expect(postOrderCartCartIdCheckout).not.toHaveBeenCalled();
  });
});

describe('checkoutVcdaOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(postOrderCartCartIdCheckout).mockResolvedValue({
      data: { orderId: 42 },
    } as never);
  });

  it('checks out the cart with auto-pay and waived retractation period', async () => {
    await checkoutVcdaOrder('cart-123');

    expect(postOrderCartCartIdCheckout).toHaveBeenCalledWith({
      cartId: 'cart-123',
      autoPayWithPreferredPaymentMethod: true,
      waiveRetractationPeriod: true,
    });
  });
});
