import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createCart } from '@ovh-ux/manager-module-order';

import { getJSON, postJSON } from '@/data/api/Client.api';
import {
  MOCK_CART_ID,
  PAYGO_VAULT_PLAN_CODE,
  mockCartOptionDefinitions,
  mockCartProductDefinitions,
  mockCartServiceOffers,
} from '@/mocks/order/order.mock';
import {
  BACKUP_SERVICES_CART_ITEM_ENDPOINT,
  ORDER_CART_ROUTE,
  getBackupServicesCartItemRoute,
  getBackupServicesCartOptionRoute,
  getCartItemConfigurationRoute,
  getCartItemRequiredConfigurationRoute,
  getCartServiceOptionRoute,
  getOrderCartAssignRoute,
  getOrderCartCheckoutRoute,
} from '@/utils/apiRoutes/apiRoutes';
import { BACKUP_LICENSES_ORDER_PLAN_CODES } from '@/utils/orderComposition/orderComposition';

import {
  UNAVAILABLE_CART_OFFER,
  addBackupServicesOption,
  assignOrderCart,
  configureCartItem,
  createBackupServicesCart,
  createOrderCart,
  discoverBackupServicesOrderParameters,
  getBackupServicesCartOptionDefinitions,
  getBackupServicesCartProductDefinitions,
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

  it('reads the offered plans on the very route that adds the main item', async () => {
    mockedGetJSON.mockResolvedValue(mockCartProductDefinitions);

    await expect(getBackupServicesCartProductDefinitions(MOCK_CART_ID)).resolves.toBe(
      mockCartProductDefinitions,
    );
    expect(mockedGetJSON).toHaveBeenCalledWith('v6', getBackupServicesCartItemRoute(MOCK_CART_ID));
  });

  it('reads the offered addons of the main plan, whose plan code goes in the query', async () => {
    mockedGetJSON.mockResolvedValue(mockCartOptionDefinitions);

    await expect(
      getBackupServicesCartOptionDefinitions(MOCK_CART_ID, 'backup-tenant'),
    ).resolves.toBe(mockCartOptionDefinitions);
    expect(mockedGetJSON).toHaveBeenCalledWith(
      'v6',
      getBackupServicesCartOptionRoute(MOCK_CART_ID),
      { params: { planCode: 'backup-tenant' } },
    );
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

describe('discoverBackupServicesOrderParameters', () => {
  const { tenant, vspcTenant, vspcTenantLicenses, bundledVault } = BACKUP_LICENSES_ORDER_PLAN_CODES;

  const product = {
    planCode: tenant,
    options: [
      { planCode: vspcTenant, options: [{ planCode: vspcTenantLicenses, options: [] }] },
      { planCode: bundledVault, options: [] },
    ],
  };

  const optionsFor = (...planCodes: string[]) =>
    mockCartOptionDefinitions.filter((offer) => planCodes.includes(offer.planCode));

  /** Chaque parent n'offre que ses propres addons, comme le catalogue réel. */
  const serveDefinitions = (
    optionsByParent: Record<string, unknown> = {
      [tenant]: optionsFor(vspcTenant, bundledVault),
      [vspcTenant]: optionsFor(vspcTenantLicenses),
    },
    products: unknown = mockCartProductDefinitions,
  ) =>
    mockedGetJSON.mockImplementation((_version, route, config) =>
      Promise.resolve(
        route.endsWith('/options')
          ? (optionsByParent[
              (config as { params?: { planCode?: string } })?.params?.planCode ?? ''
            ] ?? [])
          : products,
      ),
    );

  const discover = () => discoverBackupServicesOrderParameters(MOCK_CART_ID, product);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asks each parent for its own options, never the tenant for a nested addon', async () => {
    serveDefinitions();

    await discover();

    expect(mockedGetJSON).toHaveBeenCalledWith('v6', getBackupServicesCartItemRoute(MOCK_CART_ID));
    expect(mockedGetJSON).toHaveBeenCalledWith(
      'v6',
      getBackupServicesCartOptionRoute(MOCK_CART_ID),
      { params: { planCode: tenant } },
    );
    expect(mockedGetJSON).toHaveBeenCalledWith(
      'v6',
      getBackupServicesCartOptionRoute(MOCK_CART_ID),
      { params: { planCode: vspcTenant } },
    );
  });

  it('takes the conditions each plan announces, not the monthly pattern', async () => {
    serveDefinitions();

    await expect(discover()).resolves.toEqual({
      duration: 'P1M',
      planCode: tenant,
      pricingMode: 'default',
      quantity: 1,
      options: [
        {
          duration: 'P1M',
          planCode: vspcTenant,
          pricingMode: 'default',
          quantity: 1,
          options: [
            {
              duration: 'P1M',
              planCode: vspcTenantLicenses,
              pricingMode: 'consumption',
              quantity: 1,
              options: [],
            },
          ],
        },
        {
          duration: 'P1Y',
          planCode: bundledVault,
          pricingMode: 'default',
          quantity: 2,
          options: [],
        },
      ],
    });
  });

  it('keeps the addons in the order asked, so one can depend on the previous', async () => {
    serveDefinitions({
      [tenant]: optionsFor(vspcTenant, bundledVault).reverse(),
      [vspcTenant]: optionsFor(vspcTenantLicenses),
    });

    const { options } = await discover();

    expect(options.map(({ planCode }) => planCode)).toEqual([vspcTenant, bundledVault]);
  });

  it('refuses, naming the addon the cart does not offer under its parent', async () => {
    serveDefinitions({ [tenant]: optionsFor(vspcTenant, bundledVault) });

    await expect(discover()).rejects.toThrow(`${UNAVAILABLE_CART_OFFER}: ${vspcTenantLicenses}`);
  });

  it('refuses, naming the main plan when the cart offers no product at all', async () => {
    serveDefinitions(undefined, []);

    await expect(discover()).rejects.toThrow(`${UNAVAILABLE_CART_OFFER}: ${tenant}`);
  });

  it('names every missing addon at once, so one pass tells the whole story', async () => {
    serveDefinitions({});

    await expect(discover()).rejects.toThrow(
      `${UNAVAILABLE_CART_OFFER}: ${[vspcTenant, bundledVault].join(', ')}`,
    );
  });
});
