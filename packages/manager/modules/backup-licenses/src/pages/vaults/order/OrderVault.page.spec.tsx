import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TEST_VAULT_OFFER_PRICE_IN_UCENTS,
  buildTestOfferPricing,
  mockCartServiceOffers,
  mockCartServiceOffersWithoutVault,
  mockVaultServiceOffer,
} from '@/mocks/order/order.mock';
import { labels } from '@/test-utils/i18ntest.utils';

import { VAULT_ORDER_TEST_IDS } from './OrderVault.page';
import {
  LOCATIONS,
  SERVICE_NAME,
  addSuccessMock,
  cancelButton,
  chooseCountry,
  chooseRegion,
  clickCancel,
  clickSubmit,
  countryOptionLabels,
  countrySelect,
  fillValidOrder,
  isDisabled,
  isEnabled,
  mockedGetBackupServicesOffers,
  mockedOrderVault,
  nameAccessibleName,
  nameErrorLiveRegion,
  nameFieldError,
  nameInput,
  navigateMock,
  pricingMessage,
  pricingSkeleton,
  regionFieldError,
  regionOptionLabels,
  regionSelect,
  renderOrderModal,
  resolveServiceName,
  submitButton,
  submitFromKeyboard,
  typeName,
} from './_test/order.harness';

vi.mock('@/data/api/order/order.requests');
vi.mock('@/data/api/tenants/tenants.requests');
vi.mock('@/data/api/backupLicenses/backupLicenses.requests');
vi.mock('@/data/api/vaults/vaults.requests', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/data/api/vaults/vaults.requests')>()),
  orderVault: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigateMock,
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@ovh-ux/manager-react-components')>()),
  useNotifications: () => ({ addSuccess: addSuccessMock, addError: vi.fn() }),
}));

const order = labels.vaults.order;

/** The price Agora serves, deliberately fictional — see the warning on `order.mock.ts`. */
const TEST_PRICE_TEXT = buildTestOfferPricing(TEST_VAULT_OFFER_PRICE_IN_UCENTS).price.text;

const pricingSentence = (price: string) => order.pricing_message.replace('{{price}}', price);

describe('OrderVaultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedOrderVault.mockResolvedValue(undefined);
    mockedGetBackupServicesOffers.mockResolvedValue(mockCartServiceOffers);
    resolveServiceName();
  });

  it('collects a vault name, a country and a storage region, and asks for nothing else', async () => {
    await renderOrderModal();

    expect(await screen.findByText(order.field.name.label)).toBeVisible();
    expect(screen.getByText(order.field.country.label)).toBeVisible();
    expect(screen.getByText(order.field.region.label)).toBeVisible();
    expect(nameInput()).toBeTruthy();
    await waitFor(() => expect(regionSelect()).toBeTruthy());
  });

  it('offers no vault type to choose, because ordering is pay-as-you-go only', async () => {
    await renderOrderModal();

    await waitFor(() => expect(regionSelect()).toBeTruthy());
    expect(screen.queryByText(labels.order.step.license_type.label)).not.toBeInTheDocument();
    expect(document.querySelectorAll('ods-radio')).toHaveLength(0);
    // Three form controls in the modal (name, country, region), so no fourth input slipped in from the mockup.
    expect(document.querySelectorAll('ods-input, ods-select')).toHaveLength(3);
  });

  describe('the pay-as-you-go rate, which the mockup omits and the ticket requires', () => {
    it('states it at the rate the offer serves, interpolated into the sentence', async () => {
      await renderOrderModal();

      await waitFor(() => expect(pricingMessage()).toBeVisible());
      expect(pricingMessage()).toHaveTextContent(pricingSentence(TEST_PRICE_TEXT));
    });

    it('ships no figure of its own: the sentence carries a placeholder, never an amount', () => {
      expect(order.pricing_message).toContain('{{price}}');
      expect(order.pricing_message).not.toMatch(/\d/);
    });

    it('skeletons the sentence while the offers are in flight, rather than half-stating it', async () => {
      mockedGetBackupServicesOffers.mockReturnValue(new Promise(() => undefined));

      await renderOrderModal();

      await waitFor(() => expect(pricingSkeleton()).toBeVisible());
      expect(pricingMessage()).not.toBeInTheDocument();
    });

    it('drops the whole message when the catalogue serves no vault offer', async () => {
      mockedGetBackupServicesOffers.mockResolvedValue(mockCartServiceOffersWithoutVault);

      await renderOrderModal();

      await waitFor(() => expect(pricingSkeleton()).not.toBeInTheDocument());
      expect(pricingMessage()).not.toBeInTheDocument();
      // The sentence is gone whole: no orphan fragment of it survives without its rate.
      expect(screen.queryByText(/pay-as-you-go/)).not.toBeInTheDocument();
    });

    it('drops it just as silently when the offers route itself is unreachable', async () => {
      mockedGetBackupServicesOffers.mockRejectedValue(new Error('catalogue not declared'));

      await renderOrderModal();

      await waitFor(() => expect(pricingSkeleton()).not.toBeInTheDocument());
      expect(pricingMessage()).not.toBeInTheDocument();
      expect(screen.getByTestId(VAULT_ORDER_TEST_IDS.submit)).toBeVisible();
    });

    it('drops it when the vault offer carries no price at all', async () => {
      mockedGetBackupServicesOffers.mockResolvedValue([{ ...mockVaultServiceOffer, prices: [] }]);

      await renderOrderModal();

      await waitFor(() => expect(pricingSkeleton()).not.toBeInTheDocument());
      expect(pricingMessage()).not.toBeInTheDocument();
    });
  });

  it('starts with both fields empty and the order control locked', async () => {
    await renderOrderModal();

    await waitFor(() => expect(regionSelect()).toBeTruthy());
    expect(nameInput().getAttribute('value')).toBe('');
    expect(countrySelect().getAttribute('value')).toBe('');
    expect(regionSelect().getAttribute('value')).toBe('');
    expect(isDisabled(submitButton())).toBe(true);
  });

  it('disables the region select until a country is picked', async () => {
    await renderOrderModal();

    await waitFor(() => expect(regionSelect()).toBeTruthy());
    expect(isDisabled(regionSelect())).toBe(true);

    chooseCountry();

    await waitFor(() => expect(isDisabled(regionSelect())).toBe(false));
  });

  it('lists each country of the referential, flagged and sorted alphabetically', async () => {
    await renderOrderModal();

    await waitFor(() => expect(countryOptionLabels()).toHaveLength(8));
    expect(countryOptionLabels()).toEqual([
      '🇩🇪 Allemagne',
      '🇦🇺 Australie',
      '🇨🇦 Canada',
      '🇫🇷 France',
      '🇮🇳 Inde',
      '🇵🇱 Pologne',
      '🇬🇧 Royaume-Uni',
      '🇸🇬 Singapour',
    ]);
  });

  it('lists the region for the picked country only, named as the funnel names it', async () => {
    await renderOrderModal();
    await waitFor(() => expect(regionSelect()).toBeTruthy());

    chooseCountry();

    // Sorted alphabetically, regardless of the fixture's order.
    await waitFor(() =>
      expect(regionOptionLabels()).toEqual([
        'Gravelines (eu-west-gra)',
        'Roubaix (eu-west-rbx)',
        'Strasbourg (eu-west-sbg)',
      ]),
    );
  });

  it('keeps the order control locked until a region is chosen', async () => {
    await renderOrderModal();
    await waitFor(() => expect(regionSelect()).toBeTruthy());

    typeName('vault-paygo-01');

    await waitFor(() => expect(nameFieldError()).toBeNull());
    expect(isDisabled(submitButton())).toBe(true);
    expect(regionFieldError()).toBeNull();
  });

  it('orders the vault the customer described, confirms it, and closes', async () => {
    await renderOrderModal();
    await fillValidOrder('vault-paygo-01');

    await clickSubmit();

    await waitFor(() =>
      expect(mockedOrderVault).toHaveBeenCalledWith(
        { name: 'vault-paygo-01', region: LOCATIONS[0]!.name },
        // The service the option is bought onto is resolved, not asked of the customer.
        expect.objectContaining({ serviceName: SERVICE_NAME }),
      ),
    );
    expect(addSuccessMock).toHaveBeenCalledWith(order.success);
    expect(navigateMock).toHaveBeenCalledWith('/vaults');
  });

  it('reports a refused order inside the modal, and gives up none of the input', async () => {
    mockedOrderVault.mockRejectedValue(new Error('channel down'));

    await renderOrderModal();
    await fillValidOrder('vault-paygo-01');
    await clickSubmit();

    expect(await screen.findByTestId(VAULT_ORDER_TEST_IDS.error)).toHaveTextContent(
      order.error.submit_failed,
    );
    expect(nameInput().getAttribute('value')).toBe('vault-paygo-01');
    expect(regionSelect().getAttribute('value')).toBe(LOCATIONS[0]!.name);
    expect(navigateMock).not.toHaveBeenCalled();
    expect(addSuccessMock).not.toHaveBeenCalled();
  });

  it('announces that failure, instead of only drawing it', async () => {
    mockedOrderVault.mockRejectedValue(new Error('channel down'));

    await renderOrderModal();
    await fillValidOrder('vault-paygo-01');
    // The region has to pre-exist the failure: assistive tech ignores one that appears with its text.
    const liveRegion = screen.getByRole('alert');
    expect(liveRegion).toBeEmptyDOMElement();

    await clickSubmit();

    await waitFor(() => expect(liveRegion).toHaveTextContent(order.error.submit_failed));
  });

  it('prefers the reason the API gives over its own wording', async () => {
    mockedOrderVault.mockRejectedValue({
      response: { status: 503, data: { message: 'Ordering is temporarily unavailable' } },
    });

    await renderOrderModal();
    await fillValidOrder('vault-paygo-01');
    await clickSubmit();

    expect(await screen.findByTestId(VAULT_ORDER_TEST_IDS.error)).toHaveTextContent(
      'Ordering is temporarily unavailable',
    );
  });

  describe('a name the backend refuses', () => {
    const refused = {
      response: { status: 409, data: { message: 'This vault name is already taken' } },
    };

    it('lands on the field the customer has to change, not in a modal-level banner', async () => {
      mockedOrderVault.mockRejectedValue(refused);

      await renderOrderModal();
      await fillValidOrder('vault-paygo-01');
      await clickSubmit();

      await waitFor(() => expect(nameFieldError()).toBe('This vault name is already taken'));
      expect(screen.queryByTestId(VAULT_ORDER_TEST_IDS.error)).not.toBeInTheDocument();
    });

    it('is announced and carried by the accessible name of the field it belongs to', async () => {
      mockedOrderVault.mockRejectedValue(refused);

      await renderOrderModal();
      await fillValidOrder('vault-paygo-01');
      // Live region present before the failure: assistive tech ignores one that appears with its text.
      expect(nameErrorLiveRegion()).toBeEmptyDOMElement();
      await clickSubmit();

      await waitFor(() =>
        expect(nameAccessibleName()).toBe(
          `${order.field.name.label}, This vault name is already taken`,
        ),
      );
    });

    it('keeps the modal open on the entered values, and takes a new name straight away', async () => {
      mockedOrderVault.mockRejectedValue(refused);

      await renderOrderModal();
      await fillValidOrder('vault-paygo-01');
      await clickSubmit();

      await waitFor(() => expect(nameFieldError()).toBe('This vault name is already taken'));
      expect(nameInput().getAttribute('value')).toBe('vault-paygo-01');
      expect(navigateMock).not.toHaveBeenCalled();

      typeName('vault-paygo-02');

      await waitFor(() => expect(nameFieldError()).toBeNull());
      expect(isEnabled(submitButton())).toBe(true);
    });

    it('moves the focus to the name, so the customer is not left where they were', async () => {
      mockedOrderVault.mockRejectedValue(refused);

      await renderOrderModal();
      await fillValidOrder('vault-paygo-01');
      const focus = vi.spyOn(nameInput() as HTMLElement, 'focus');
      await clickSubmit();

      await waitFor(() => expect(focus).toHaveBeenCalled());
    });
  });

  it('focuses the field in error when an invalid form is submitted from the keyboard', async () => {
    await renderOrderModal();
    await waitFor(() => expect(regionSelect()).toBeTruthy());

    typeName('my_vault');
    await chooseRegion();
    // ODS 18 submits the form on Enter inside an input, so the disabled primary button is not the only
    // way in; the ODS host delegates the focus it receives to the control inside its shadow root.
    const focus = vi.spyOn(nameInput() as HTMLElement, 'focus');
    submitFromKeyboard();

    await waitFor(() => expect(nameFieldError()).toBe(order.error.name_format));
    expect(focus).toHaveBeenCalled();
    expect(mockedOrderVault).not.toHaveBeenCalled();
  });

  it('freezes the form while the order is in flight, but never the way out', async () => {
    mockedOrderVault.mockReturnValue(new Promise(() => undefined));

    await renderOrderModal();
    await fillValidOrder('vault-paygo-01');
    await clickSubmit();

    await waitFor(() => expect(isDisabled(nameInput())).toBe(true));
    expect(isDisabled(regionSelect())).toBe(true);
    expect(submitButton().getAttribute('is-loading')).toBe('true');
    expect(isDisabled(cancelButton())).toBe(false);
  });

  it('leaves without ordering anything when the customer cancels', async () => {
    await renderOrderModal();
    await fillValidOrder('vault-paygo-01');

    clickCancel();

    expect(mockedOrderVault).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/vaults');
  });
});
