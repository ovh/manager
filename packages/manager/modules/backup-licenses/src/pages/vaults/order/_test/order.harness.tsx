import React from 'react';

import { RenderResult, fireEvent, screen, waitFor } from '@testing-library/react';
import { expect, vi } from 'vitest';

import { fieldErrorId } from '@/components/FieldError/FieldError.component';
import { getBackupServicesOffers } from '@/data/api/order/order.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { orderVault } from '@/data/api/vaults/vaults.requests';
import { LOCATION_DEFINITIONS } from '@/data/locations.data';
import {
  BACKUP_SERVICES_TENANT_ID,
  mockBackupServicesTenants,
  mockVspcTenants,
} from '@/mocks/tenants/tenants.mock';

import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import OrderVaultPage, { VAULT_ORDER_TEST_IDS } from '../OrderVault.page';
import { VAULT_ORDER_NAME_FIELD_ID } from '../_components/VaultNameField.component';
import { VAULT_ORDER_PRICING_TEST_IDS } from '../_components/VaultPricingMessage.component';
import {
  VAULT_ORDER_COUNTRY_FIELD_ID,
  VAULT_ORDER_REGION_FIELD_ID,
} from '../_components/VaultRegionField.component';

export const navigateMock = vi.fn();
export const addSuccessMock = vi.fn();

/** Catalogue en dur réellement servi par `useLocations` (BKP-1223). */
export const LOCATIONS = LOCATION_DEFINITIONS;

export const mockedOrderVault = vi.mocked(orderVault);
export const mockedGetBackupServicesOffers = vi.mocked(getBackupServicesOffers);
export const mockedGetBackupServicesTenants = vi.mocked(getBackupServicesTenants);

export const resolveServiceName = () => {
  mockedGetBackupServicesTenants.mockResolvedValue(mockBackupServicesTenants);
  vi.mocked(getVspcTenants).mockResolvedValue(mockVspcTenants);
};

export const SERVICE_NAME = BACKUP_SERVICES_TENANT_ID;

export const renderOrderModal = (): Promise<RenderResult> =>
  renderWithProviders(<OrderVaultPage />);

const host = (id: string) => document.getElementById(id) as Element;

export const nameInput = () => host(VAULT_ORDER_NAME_FIELD_ID);
export const countrySelect = () => host(VAULT_ORDER_COUNTRY_FIELD_ID);
export const regionSelect = () => host(VAULT_ORDER_REGION_FIELD_ID);
export const submitButton = () => screen.getByTestId(VAULT_ORDER_TEST_IDS.submit);
export const cancelButton = () => screen.getByTestId(VAULT_ORDER_TEST_IDS.cancel);
export const pricingMessage = () => screen.queryByTestId(VAULT_ORDER_PRICING_TEST_IDS.message);
export const pricingSkeleton = () => screen.queryByTestId(VAULT_ORDER_PRICING_TEST_IDS.skeleton);

/**
 * Both are strict on purpose: the ODS React wrapper applies props after the commit, so a missing
 * `is-disabled` means "not settled yet", not "enabled" — reading it as enabled asserts on a control
 * whose state has not landed.
 */
export const isDisabled = (element: Element) => element.getAttribute('is-disabled') === 'true';
export const isEnabled = (element: Element) => element.getAttribute('is-disabled') === 'false';

/**
 * Activated with `fireEvent`, not user-event: the ODS button keeps the `disabled` of its own earlier
 * render on the host for a tick after React has enabled it, and user-event declines to dispatch on a
 * disabled element without reporting anything — the click is simply lost. Waiting for that attribute
 * to clear deadlocks, since ODS drops it on the render the click itself causes. The gate that matters
 * is still asserted: React only binds the handler once the form is valid.
 */
const activate = async (element: Element) => {
  await waitFor(() => expect(isEnabled(element)).toBe(true));
  fireEvent.click(element);
};

export const clickSubmit = () => activate(submitButton());
export const clickCancel = () => fireEvent.click(cancelButton());

/** The path the disabled primary button does not close: ODS 18 submits the form on Enter in an input. */
export const submitFromKeyboard = () =>
  fireEvent.submit(document.querySelector('form') as HTMLFormElement);

/**
 * ODS 18 controls emit their value through a custom event, and their inner control lives in a shadow
 * root that a native change never reaches — so the event is what a test fires.
 */
const emitChange = (element: Element, value: string) =>
  fireEvent(element, new CustomEvent('odsChange', { detail: { value } }));

export const typeName = (value: string) => emitChange(nameInput(), value);
export const blurName = () => fireEvent(nameInput(), new CustomEvent('odsBlur'));

export const chooseCountry = (countryCode = LOCATIONS[0]!.countryCode) =>
  emitChange(countrySelect(), countryCode);

export const chooseRegion = async (region = LOCATIONS[0]!.name) => {
  const location = LOCATIONS.find(
    (candidate) => candidate.name === region,
  ) as (typeof LOCATIONS)[number];
  chooseCountry(location.countryCode);
  await waitFor(() => expect(isEnabled(regionSelect())).toBe(true));
  emitChange(regionSelect(), region);
};

export const fillValidOrder = async (name = 'vault-paygo-01') => {
  await waitFor(() => expect(regionSelect()).toBeTruthy());
  typeName(name);
  await chooseRegion();
  await waitFor(() => expect(isEnabled(submitButton())).toBe(true));
};

export const countryOptionLabels = () =>
  [...(countrySelect().shadowRoot?.querySelectorAll('option') ?? [])]
    .map((option) => option.textContent)
    .filter(Boolean);

export const regionOptionLabels = () =>
  [...(regionSelect().shadowRoot?.querySelectorAll('option') ?? [])]
    .map((option) => option.textContent)
    .filter(Boolean);

/** Read where assistive tech reads it: the light-DOM live region, not ODS's shadow-root message. */
export const fieldErrorOf = (fieldId: string) =>
  document.getElementById(fieldErrorId(fieldId))?.textContent || null;

export const nameFieldError = () => fieldErrorOf(VAULT_ORDER_NAME_FIELD_ID);
export const regionFieldError = () => fieldErrorOf(VAULT_ORDER_REGION_FIELD_ID);

export const nameErrorLiveRegion = () =>
  document.getElementById(fieldErrorId(VAULT_ORDER_NAME_FIELD_ID)) as Element;

export const nameAccessibleName = () => nameInput().getAttribute('aria-label');
