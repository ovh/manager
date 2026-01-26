import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createCart, postConfigureCartItem } from '../cart';

const mockPost = vi.fn();
const mockGet = vi.fn();

vi.mock('@ovh-ux/manager-core-api', () => ({
  apiClient: {
    v6: {
      post: (...args: unknown[]) =>
        (mockPost(...args) as unknown) as ReturnType<typeof mockPost>,
      get: (...args: unknown[]) =>
        (mockGet(...args) as unknown) as ReturnType<typeof mockGet>,
    },
  },
}));

// eslint-disable-next-line max-lines-per-function
describe('createCart', () => {
  const mockCartId = 'cart-123';
  const mockItemId = 111;
  const mockOptionItemId = 222;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a simple cart without configurations or productOptions', async () => {
    mockPost
      .mockResolvedValueOnce({ data: { cartId: mockCartId } }) // POST /order/cart
      .mockResolvedValueOnce({ data: { itemId: mockItemId } }) // POST /order/cart/{id}/okms
      .mockResolvedValueOnce({}); // POST /order/cart/{id}/assign

    mockGet.mockResolvedValueOnce({
      data: { contracts: [{ name: 'contract1', url: 'http://contract.url' }] },
    });

    const result = await createCart({
      ovhSubsidiary: 'FR',
      items: [
        {
          itemEndpoint: 'okms',
          options: { planCode: 'okms', pricingMode: 'default', quantity: 1 },
        },
      ],
    });

    expect(mockPost).toHaveBeenNthCalledWith(1, '/order/cart', {
      ovhSubsidiary: 'FR',
    });
    expect(mockPost).toHaveBeenNthCalledWith(
      2,
      `/order/cart/${mockCartId}/okms`,
      {
        planCode: 'okms',
        pricingMode: 'default',
        quantity: 1,
      },
    );
    expect(mockPost).toHaveBeenNthCalledWith(
      3,
      `/order/cart/${mockCartId}/assign`,
      {
        cartId: mockCartId,
      },
    );
    expect(mockGet).toHaveBeenCalledWith(`/order/cart/${mockCartId}/checkout`);
    expect(result).toEqual({
      cartId: mockCartId,
      contractList: [{ name: 'contract1', url: 'http://contract.url' }],
    });
  });

  it('creates a cart with configurations on the main item', async () => {
    mockPost
      .mockResolvedValueOnce({ data: { cartId: mockCartId } }) // POST /order/cart
      .mockResolvedValueOnce({ data: { itemId: mockItemId } }) // POST /order/cart/{id}/okms
      .mockResolvedValueOnce({}) // POST config region
      .mockResolvedValueOnce({}); // POST /order/cart/{id}/assign

    mockGet.mockResolvedValueOnce({
      data: { contracts: [] },
    });

    await createCart({
      ovhSubsidiary: 'FR',
      items: [
        {
          itemEndpoint: 'okms',
          options: {
            planCode: 'okms',
            pricingMode: 'default',
            quantity: 1,
            duration: 'P1M',
          },
          configurations: [{ label: 'region', value: 'eu-west-1' }],
        },
      ],
    });

    expect(mockPost).toHaveBeenNthCalledWith(
      3,
      `/order/cart/${mockCartId}/item/${mockItemId}/configuration`,
      { label: 'region', value: 'eu-west-1' },
    );
  });

  // eslint-disable-next-line max-lines-per-function
  it('creates a cart with productOptions (child items)', async () => {
    // Mock responses - order may vary due to Promise.all
    mockPost.mockImplementation((url: string) => {
      if (url === '/order/cart') {
        return Promise.resolve({ data: { cartId: mockCartId } });
      }
      if (url === `/order/cart/${mockCartId}/backupServices`) {
        return Promise.resolve({ data: { itemId: mockItemId } });
      }
      if (url === `/order/cart/${mockCartId}/backupServices/options`) {
        return Promise.resolve({ data: { itemId: mockOptionItemId } });
      }
      return Promise.resolve({});
    });

    mockGet.mockResolvedValueOnce({
      data: {
        contracts: [{ name: 'backup-contract', url: 'http://backup.url' }],
      },
    });

    const result = await createCart({
      ovhSubsidiary: 'FR',
      items: [
        {
          itemEndpoint: 'backupServices',
          options: {
            planCode: 'backup-tenant',
            pricingMode: 'default',
            quantity: 1,
          },
          productOptions: [
            {
              planCode: 'backup-vault-paygo',
              pricingMode: 'default',
              quantity: 1,
              configurations: [
                { label: 'agent-ip', value: '192.168.1.1' },
                { label: 'agent-regionname', value: 'GRA' },
                { label: 'agent-servicename', value: 'ns123456.ip-1-2-3.eu' },
              ],
            },
            {
              planCode: 'vspc-tenant',
              pricingMode: 'default',
              quantity: 1,
            },
          ],
        },
      ],
    });

    // Check that cart was created
    expect(mockPost).toHaveBeenCalledWith('/order/cart', {
      ovhSubsidiary: 'FR',
    });

    // Check that main item was added
    expect(mockPost).toHaveBeenCalledWith(
      `/order/cart/${mockCartId}/backupServices`,
      {
        planCode: 'backup-tenant',
        pricingMode: 'default',
        quantity: 1,
      },
    );

    // Check that backup-vault-paygo option was added with parent itemId
    expect(mockPost).toHaveBeenCalledWith(
      `/order/cart/${mockCartId}/backupServices/options`,
      {
        itemId: mockItemId,
        planCode: 'backup-vault-paygo',
        pricingMode: 'default',
        quantity: 1,
      },
    );

    // Check that vspc-tenant option was added with parent itemId
    expect(mockPost).toHaveBeenCalledWith(
      `/order/cart/${mockCartId}/backupServices/options`,
      {
        itemId: mockItemId,
        planCode: 'vspc-tenant',
        pricingMode: 'default',
        quantity: 1,
      },
    );

    // Check that configurations were applied to the option item
    expect(
      mockPost,
    ).toHaveBeenCalledWith(
      `/order/cart/${mockCartId}/item/${mockOptionItemId}/configuration`,
      { label: 'agent-ip', value: '192.168.1.1' },
    );
    expect(
      mockPost,
    ).toHaveBeenCalledWith(
      `/order/cart/${mockCartId}/item/${mockOptionItemId}/configuration`,
      { label: 'agent-regionname', value: 'GRA' },
    );
    expect(
      mockPost,
    ).toHaveBeenCalledWith(
      `/order/cart/${mockCartId}/item/${mockOptionItemId}/configuration`,
      { label: 'agent-servicename', value: 'ns123456.ip-1-2-3.eu' },
    );

    // Check that cart was assigned
    expect(mockPost).toHaveBeenCalledWith(`/order/cart/${mockCartId}/assign`, {
      cartId: mockCartId,
    });

    expect(result).toEqual({
      cartId: mockCartId,
      contractList: [{ name: 'backup-contract', url: 'http://backup.url' }],
    });
  });

  it('creates a cart with both main item configurations and productOptions', async () => {
    mockPost
      .mockResolvedValueOnce({ data: { cartId: mockCartId } }) // POST /order/cart
      .mockResolvedValueOnce({ data: { itemId: mockItemId } }) // POST /order/cart/{id}/product
      .mockResolvedValueOnce({}) // POST config on main item
      .mockResolvedValueOnce({ data: { itemId: mockOptionItemId } }) // POST option
      .mockResolvedValueOnce({}) // POST config on option
      .mockResolvedValueOnce({}); // POST assign

    mockGet.mockResolvedValueOnce({ data: { contracts: [] } });

    await createCart({
      ovhSubsidiary: 'DE',
      items: [
        {
          itemEndpoint: 'product',
          options: { planCode: 'plan', pricingMode: 'default', quantity: 1 },
          configurations: [{ label: 'main-config', value: 'value1' }],
          productOptions: [
            {
              planCode: 'option-plan',
              pricingMode: 'default',
              quantity: 2,
              configurations: [{ label: 'option-config', value: 'value2' }],
            },
          ],
        },
      ],
    });

    // Main item configuration
    expect(mockPost).toHaveBeenNthCalledWith(
      3,
      `/order/cart/${mockCartId}/item/${mockItemId}/configuration`,
      { label: 'main-config', value: 'value1' },
    );

    // Product option added
    expect(mockPost).toHaveBeenNthCalledWith(
      4,
      `/order/cart/${mockCartId}/product/options`,
      {
        itemId: mockItemId,
        planCode: 'option-plan',
        pricingMode: 'default',
        quantity: 2,
      },
    );

    // Option item configuration
    expect(mockPost).toHaveBeenNthCalledWith(
      5,
      `/order/cart/${mockCartId}/item/${mockOptionItemId}/configuration`,
      { label: 'option-config', value: 'value2' },
    );
  });

  it('creates a cart with multiple items', async () => {
    mockPost
      .mockResolvedValueOnce({ data: { cartId: mockCartId } }) // POST /order/cart
      .mockResolvedValueOnce({ data: { itemId: mockItemId } }) // POST /order/cart/{id}/item1
      .mockResolvedValueOnce({ data: { itemId: mockOptionItemId } }) // POST /order/cart/{id}/item2
      .mockResolvedValueOnce({}); // POST assign

    mockGet.mockResolvedValueOnce({ data: { contracts: [] } });

    await createCart({
      ovhSubsidiary: 'FR',
      items: [
        {
          itemEndpoint: 'item1',
          options: { planCode: 'plan1', pricingMode: 'default', quantity: 1 },
        },
        {
          itemEndpoint: 'item2',
          options: { planCode: 'plan2', pricingMode: 'default', quantity: 1 },
        },
      ],
    });

    expect(mockPost).toHaveBeenCalledWith(`/order/cart/${mockCartId}/item1`, {
      planCode: 'plan1',
      pricingMode: 'default',
      quantity: 1,
    });
    expect(mockPost).toHaveBeenCalledWith(`/order/cart/${mockCartId}/item2`, {
      planCode: 'plan2',
      pricingMode: 'default',
      quantity: 1,
    });
  });
});

describe('postConfigureCartItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts configuration to the correct endpoint', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 'config-123' } });

    await postConfigureCartItem({
      cartId: 'cart-456',
      itemId: 789,
      label: 'region',
      value: 'eu-west-1',
    });

    expect(mockPost).toHaveBeenCalledWith(
      '/order/cart/cart-456/item/789/configuration',
      {
        label: 'region',
        value: 'eu-west-1',
      },
    );
  });
});
