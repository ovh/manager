import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getVaultActionsTriggerId } from '@/pages/vaults/vaults.constants';
import { setupMswMock } from '@/test-utils/setupMsw';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';

import TerminateVaultPage from './TerminateVault.page';

/**
 * `USE_API_MOCKS` court-circuite le réseau et renvoie les jeux de données du module. Ces tests
 * paramètrent leurs propres fixtures via MSW, donc ils laissent la couche réseau s'exécuter.
 */
vi.mock('@/mocks/mocks.config', () => ({ USE_API_MOCKS: false }));

const navigateMock = vi.fn();
const addSuccessMock = vi.fn();
let vaultIdParam = 'vault-2';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ vaultId: vaultIdParam }),
  };
});

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => ({ addSuccess: addSuccessMock, addError: vi.fn() }),
  DeleteModal: ({
    children,
    onConfirmDelete,
    closeModal,
    error,
    isLoading,
  }: {
    children?: React.ReactNode;
    onConfirmDelete: () => void;
    closeModal: () => void;
    error?: string;
    isLoading?: boolean;
  }) => (
    <div
      data-testid="delete-modal"
      data-loading={String(!!isLoading)}
      data-error={String(error ?? '')}
    >
      {error && <p data-testid="modal-error">{error}</p>}
      {children}
      <button type="button" data-testid="confirm" disabled={isLoading} onClick={onConfirmDelete}>
        confirm
      </button>
      <button type="button" data-testid="cancel" onClick={closeModal}>
        cancel
      </button>
    </div>
  ),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsText: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
}));

/**
 * The success path runs against the real hook and MSW. The failure path forces the hook's error
 * state instead: the shared v6 service mocks answer a 500 that never propagates in this harness —
 * the mutation stays pending — so asserting on it would test the harness, not this page.
 */
let forcedDeleteError: { message: string } | undefined;

vi.mock('@ovh-ux/manager-module-common-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-module-common-api')>();
  return {
    ...actual,
    useDeleteService: (params: Parameters<typeof actual.useDeleteService>[0]) => {
      const real = actual.useDeleteService(params);
      return forcedDeleteError
        ? { ...real, isError: true, error: { response: { data: forcedDeleteError } } }
        : real;
    },
  };
});

const renderPage = async () => {
  const Providers = await testWrapperBuilder()
    .withQueryClient()
    .withI18next()
    .withShellContext()
    .build();

  return render(
    <Providers>
      <MemoryRouter>
        {/* Vaults.page.tsx renders the rows beside the <Outlet />, so the trigger outlives the modal. */}
        <button
          type="button"
          id={getVaultActionsTriggerId(vaultIdParam)}
          data-testid="row-trigger"
          aria-label="row actions"
        />
        <TerminateVaultPage />
      </MemoryRouter>
    </Providers>,
  );
};

describe('TerminateVaultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vaultIdParam = 'vault-2';
    forcedDeleteError = undefined;
  });

  it('opens on a PAYGO vault', async () => {
    setupMswMock();

    await renderPage();

    expect(await screen.findByTestId('delete-modal')).toBeInTheDocument();
  });

  it('terminates through the commercial service chain, then confirms and refreshes', async () => {
    setupMswMock();

    await renderPage();
    await userEvent.click(await screen.findByTestId('confirm'));

    await waitFor(() => expect(addSuccessMock).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/vaults');
  });

  it('gives focus back to the row control it was opened from', async () => {
    setupMswMock();

    await renderPage();
    await userEvent.click(await screen.findByTestId('cancel'));

    await waitFor(() => expect(screen.getByTestId('row-trigger')).toHaveFocus());
  });

  it('surfaces the API message inside the modal and keeps it open', async () => {
    setupMswMock();
    forcedDeleteError = { message: 'Service is locked' };

    await renderPage();

    expect(await screen.findByTestId('modal-error')).toHaveTextContent('Service is locked');
    expect(addSuccessMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('falls back to a translated message when the API gives no reason', async () => {
    setupMswMock();
    forcedDeleteError = { message: '' };

    await renderPage();

    const modalError = await screen.findByTestId('modal-error');
    expect(modalError).toBeInTheDocument();
    expect(modalError).not.toBeEmptyDOMElement();
  });

  it('refuses to open on the included vault, which a hand-typed URL could otherwise reach', async () => {
    setupMswMock();
    vaultIdParam = 'vault-1';

    await renderPage();

    await waitFor(() => expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument());
  });

  it('refuses to open on an unknown vault id', async () => {
    setupMswMock();
    vaultIdParam = 'does-not-exist';

    await renderPage();

    await waitFor(() => expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument());
  });

  it('refuses to open on a vault the route serves to another product line', async () => {
    setupMswMock();
    vaultIdParam = 'vault-foreign';

    await renderPage();

    await waitFor(() => expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument());
  });
});
