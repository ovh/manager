import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createCart } from '@ovh-ux/manager-module-order';

import { getJSON, postJSON } from '@/data/api/Client.api';
import {
  MOCK_CART_ID,
  PAYGO_VAULT_PLAN_CODE,
  mockCartServiceOffers,
} from '@/mocks/order/order.mock';
import {
  BACKUP_SERVICES_CART_ITEM_ENDPOINT,
  ORDER_CART_ROUTE,
  getCartItemConfigurationRoute,
  getCartItemRequiredConfigurationRoute,
  getCartServiceOptionRoute,
  getOrderCartAssignRoute,
  getOrderCartCheckoutRoute,
} from '@/utils/apiRoutes/apiRoutes';

import {
  addBackupServicesOption,
  assignOrderCart,
  configureCartItem,
  createBackupServicesCart,
  createOrderCart,
  getBackupServicesOffers,
  getCartItemRequiredConfiguration,
  getOrderCartCheckout,
} from './order.requests';

vi.mock('@/data/api/Client.api');
vi.mock('@ovh-ux/manager-module-order', () => ({ createCart: vi.fn() }));

const mockedGetJSON = vi.mocked(getJSON);
const mockedPostJSON = vi.mocked(postJSON);
const mockedCreateCart = vi.mocked(createCart);

const VAULT_ORDER_PARAMETERS = {
  duration: 'P1M',
  planCode: PAYGO_VAULT_PLAN_CODE,
  pricingMode: 'default',
  quantity: 1,
};

describe('order.requests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads a service offers on the cartServiceOption route of the service', async () => {
    mockedGetJSON.mockResolvedValue(mockCartServiceOffers);

    await expect(getBackupServicesOffers('backup-vault-1')).resolves.toBe(mockCartServiceOffers);
    expect(mockedGetJSON).toHaveBeenCalledWith('v6', getCartServiceOptionRoute('backup-vault-1'));
  });

  it('creates a cart with the subsidiary only', async () => {
    await createOrderCart('FR');

    expect(mockedPostJSON).toHaveBeenCalledWith('v6', ORDER_CART_ROUTE, { ovhSubsidiary: 'FR' });
  });

  it('posts the five required fields of a service option', async () => {
    await addBackupServicesOption('backup-vault-1', {
      cartId: MOCK_CART_ID,
      ...VAULT_ORDER_PARAMETERS,
    });

    expect(mockedPostJSON).toHaveBeenCalledWith('v6', getCartServiceOptionRoute('backup-vault-1'), {
      cartId: MOCK_CART_ID,
      duration: 'P1M',
      planCode: PAYGO_VAULT_PLAN_CODE,
      pricingMode: 'default',
      quantity: 1,
    });
  });

  it('reads the required configuration of a cart item', async () => {
    await getCartItemRequiredConfiguration(MOCK_CART_ID, 42);

    expect(mockedGetJSON).toHaveBeenCalledWith(
      'v6',
      getCartItemRequiredConfigurationRoute(MOCK_CART_ID, 42),
    );
  });

  it('posts one configuration label at a time', async () => {
    await configureCartItem(MOCK_CART_ID, 42, { label: 'vault_name', value: 'my-vault' });

    expect(mockedPostJSON).toHaveBeenCalledWith(
      'v6',
      getCartItemConfigurationRoute(MOCK_CART_ID, 42),
      { label: 'vault_name', value: 'my-vault' },
    );
  });

  it('assigns the cart to the logged-in account', async () => {
    await assignOrderCart(MOCK_CART_ID);

    expect(mockedPostJSON).toHaveBeenCalledWith('v6', getOrderCartAssignRoute(MOCK_CART_ID), {
      cartId: MOCK_CART_ID,
    });
  });

  it('simulates the checkout with a GET, which engages nothing', async () => {
    await getOrderCartCheckout(MOCK_CART_ID);

    expect(mockedGetJSON).toHaveBeenCalledWith('v6', getOrderCartCheckoutRoute(MOCK_CART_ID));
  });

  it('composes the funnel cart as one backupServices item with its addons', async () => {
    await createBackupServicesCart({
      ovhSubsidiary: 'FR',
      product: {
        duration: 'P1M',
        planCode: 'backup-tenant',
        pricingMode: 'default',
        quantity: 1,
        configurations: [{ label: 'displayName', value: 'backup-prod' }],
      },
      addons: [VAULT_ORDER_PARAMETERS],
    });

    expect(mockedCreateCart).toHaveBeenCalledWith({
      ovhSubsidiary: 'FR',
      items: [
        {
          itemEndpoint: BACKUP_SERVICES_CART_ITEM_ENDPOINT,
          options: {
            duration: 'P1M',
            planCode: 'backup-tenant',
            pricingMode: 'default',
            quantity: 1,
          },
          configurations: [{ label: 'displayName', value: 'backup-prod' }],
          productOptions: [VAULT_ORDER_PARAMETERS],
        },
      ],
    });
  });

  it('keeps the product parameters out of the item configurations', async () => {
    await createBackupServicesCart({
      ovhSubsidiary: 'FR',
      product: { duration: 'P1M', planCode: 'backup-tenant', pricingMode: 'default', quantity: 1 },
    });

    const [params] = mockedCreateCart.mock.lastCall ?? [];
    const item = params?.items[0];

    expect(item?.configurations).toBeUndefined();
    expect(item?.productOptions).toBeUndefined();
    expect(item?.options).toEqual({
      duration: 'P1M',
      planCode: 'backup-tenant',
      pricingMode: 'default',
      quantity: 1,
    });
  });
});
