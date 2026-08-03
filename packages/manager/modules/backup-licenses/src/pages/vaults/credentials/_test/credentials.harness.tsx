import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { mockEdgeCaseVaults, mockVaultBucketAccess, mockVaults } from '@/mocks/vaults/vaults.mock';
import { getVaultActionsTriggerId } from '@/pages/vaults/vaults.constants';
import { getVaultCredentialsUrl, routeUrls, subRoutes } from '@/routes/routes.constants';
import { labels } from '@/test-utils/i18ntest.utils';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { MockParams, setupMswMock } from '@/test-utils/setupMsw';
import { VaultBucket, VaultResource } from '@/types/Vault.type';

import VaultCredentialsPage, { VAULT_CREDENTIALS_STATUS_TEST_ID } from '../VaultCredentials.page';
import { COPY_CONFIRMATION_TEST_ID } from '../_components/CopyConfirmation.component';

/**
 * Les trois lignes de la maquette plus les cas limites : ces tests couvrent des buckets que la
 * maquette ne montre pas (primaire suspendu, deux primaires, aucun bucket).
 */
export const allMockVaults = [...mockVaults, ...mockEdgeCaseVaults];

export const findMockVault = (name: string) =>
  allMockVaults.find(({ currentState }) => currentState.name === name) as VaultResource;

export const [, paygoVault] = mockVaults as [VaultResource, VaultResource];
export const [paygoBucket] = paygoVault.currentState.buckets as [VaultBucket];

export const writeText = vi.fn<(value: string) => Promise<void>>().mockResolvedValue(undefined);
Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

export const failingAccessParams: MockParams = {
  vaults: allMockVaults,
  isVaultAccessError: true,
};

export const renderCredentials = async (
  vaultId: string,
  mockParams: MockParams = { vaults: allMockVaults },
): Promise<RenderResult> => {
  setupMswMock(mockParams);

  return renderWithProviders(
    <>
      {/* Vaults.page.tsx renders the rows beside the <Outlet />, so the trigger outlives the modal. */}
      <button
        type="button"
        id={getVaultActionsTriggerId(vaultId)}
        data-testid="row-trigger"
        aria-label={labels.vaults.action.menu_label}
      />
      <Routes>
        <Route path={routeUrls.vaults} element={<div data-testid="vaults-list" />} />
        <Route
          path={`${routeUrls.vaults}/:vaultId/${subRoutes.credentials}`}
          element={<VaultCredentialsPage />}
        />
      </Routes>
    </>,
    { initialEntries: [getVaultCredentialsUrl(vaultId)] },
  );
};

export const a11y = labels.vaults.credentials.a11y;
export const secretField = () => screen.getByTestId('vault-credentials-secret-key');
export const statusRegion = () => screen.getByTestId(VAULT_CREDENTIALS_STATUS_TEST_ID);
/** Queried by accessible name: an attribute a screen reader never reads proves nothing. */
export const byName = (name: string) => screen.getByRole('button', { name });
export const copyButton = (fieldLabel: string) =>
  byName(a11y.copy_field.replace('{{field}}', fieldLabel));
export const LIVE_REGION_SELECTOR = '[aria-live], [role="status"], [role="alert"]';
export const VALUE_TEST_IDS = [
  'vault-credentials-region',
  'vault-credentials-endpoint',
  'vault-credentials-access-key',
  'vault-credentials-secret-key',
];
/** The row holding a field's value and every control attached to that field. */
export const fieldControls = (testId: string) =>
  within(screen.getByTestId(testId).parentElement as HTMLElement).getAllByRole('button');
export const revealSecret = () => userEvent.click(byName(labels.actions.display));
export const maskSecret = () => userEvent.click(byName(labels.vaults.credentials.hide));
/**
 * Read from the rendered dialog, never from the notification store: the modal is a native
 * `<dialog>`, so a confirmation living outside it is inert and invisible to the customer.
 */
export const copyConfirmation = () =>
  within(screen.getByTestId('modal')).getByTestId(COPY_CONFIRMATION_TEST_ID);
export const copiedMessage = () =>
  within(copyConfirmation()).getByText(labels.vaults.credentials.copied_toast);

export const waitForCredentials = () =>
  screen.findByText(mockVaultBucketAccess.accessKey, undefined, { timeout: 5000 });
