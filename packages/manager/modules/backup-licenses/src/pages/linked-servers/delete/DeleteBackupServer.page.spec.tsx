import React from 'react';

import { Outlet, Route, Routes } from 'react-router-dom';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';

import type { ModalProps } from '@ovh-ux/manager-react-components';

import {
  deleteBackupServer,
  getBackupServers,
} from '@/data/api/backupServers/backupServers.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { BackupServerResource } from '@/types/BackupServer.type';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import DeleteBackupServerPage from './DeleteBackupServer.page';

vi.mock('@/data/api/backupServers/backupServers.requests');
vi.mock('@/data/api/tenants/tenants.requests');

const { addSuccess } = vi.hoisted(() => ({ addSuccess: vi.fn() }));

// `Modal` est un web component ODS sous le capot : on le remplace par un rendu DOM simple, ce
// qui permet d'asserter exactement ce que la page lui passe (convention du module, cf.
// BackupServerActionsCell.component.spec.tsx).
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useNotifications: () => ({ addSuccess, addError: vi.fn() }),
    Modal: ({
      heading,
      type,
      primaryLabel,
      onPrimaryButtonClick,
      isPrimaryButtonLoading,
      isPrimaryButtonDisabled,
      secondaryLabel,
      onSecondaryButtonClick,
      children,
    }: ModalProps) => (
      <div data-testid="modal" data-type={type}>
        <h2>{heading}</h2>
        {children}
        <button
          type="button"
          data-testid="modal-primary"
          data-loading={String(!!isPrimaryButtonLoading)}
          disabled={isPrimaryButtonDisabled}
          onClick={onPrimaryButtonClick}
        >
          {primaryLabel}
        </button>
        <button type="button" data-testid="modal-secondary" onClick={onSecondaryButtonClick}>
          {secondaryLabel}
        </button>
      </div>
    ),
  };
});

const mockedDeleteBackupServer = vi.mocked(deleteBackupServer);
const mockedGetBackupServers = vi.mocked(getBackupServers);

const server: BackupServerResource = {
  id: 'server-1',
  status: 'ENABLED',
  currentState: { id: 'server-1', displayName: 'VBR-CUST-SERV-01' },
  currentTasks: [],
};

// La modale est une route enfant de la liste : on reproduit cette imbrication pour que
// `useParams` et la fermeture par `navigate('..')` se comportent comme en vrai.
const renderModal = (initialEntry = `/linked-servers/delete/${server.id}`) =>
  renderWithProviders(
    <Routes>
      <Route
        path="/linked-servers"
        element={
          <div data-testid="linked-servers">
            <Outlet />
          </div>
        }
      >
        <Route path="delete/:backupServerId" element={<DeleteBackupServerPage />} />
      </Route>
    </Routes>,
    { initialEntries: [initialEntry] },
  );

describe('DeleteBackupServerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetBackupServers.mockResolvedValue([server]);
    mockedDeleteBackupServer.mockResolvedValue(undefined);
    vi.mocked(getBackupServicesTenants).mockResolvedValue([
      {
        id: 'service-1',
        resourceStatus: 'READY',
        currentState: { id: 'service-1', name: 'service' },
      } as Resource<BackupServicesTenant>,
    ]);
    vi.mocked(getVspcTenants).mockResolvedValue([
      {
        id: 'vspc-1',
        resourceStatus: 'READY',
        currentState: { id: 'vspc-1' },
      } as Resource<VspcTenant>,
    ]);
  });

  it('renders a critical modal and enables the confirmation once the server is known', async () => {
    await renderModal();

    expect(screen.getByTestId('modal')).toHaveAttribute('data-type', ODS_MODAL_COLOR.critical);
    await waitFor(() => expect(screen.getByTestId('modal-primary')).toBeEnabled());
  });

  it('deletes the server, notifies and closes the modal on success', async () => {
    await renderModal();

    await waitFor(() => expect(screen.getByTestId('modal-primary')).toBeEnabled());
    fireEvent.click(screen.getByTestId('modal-primary'));

    await waitFor(() => expect(addSuccess).toHaveBeenCalledTimes(1));
    expect(mockedDeleteBackupServer).toHaveBeenCalledWith({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
      backupServerId: 'server-1',
    });
    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
    expect(screen.getByTestId('linked-servers')).toBeInTheDocument();
  });

  it('keeps the modal open and shows the error inside it when the deletion fails', async () => {
    mockedDeleteBackupServer.mockRejectedValue(new Error('boom'));

    await renderModal();

    await waitFor(() => expect(screen.getByTestId('modal-primary')).toBeEnabled());
    fireEvent.click(screen.getByTestId('modal-primary'));

    await waitFor(() =>
      expect(screen.getByTestId('delete-backup-server-error')).toBeInTheDocument(),
    );
    expect(addSuccess).not.toHaveBeenCalled();
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-primary')).toBeEnabled();
  });

  it('shows a spinner on the confirmation button while the deletion is in flight', async () => {
    mockedDeleteBackupServer.mockReturnValue(new Promise(() => {}));

    await renderModal();

    await waitFor(() => expect(screen.getByTestId('modal-primary')).toBeEnabled());
    fireEvent.click(screen.getByTestId('modal-primary'));

    await waitFor(() =>
      expect(screen.getByTestId('modal-primary')).toHaveAttribute('data-loading', 'true'),
    );
  });

  it('closes itself when the server is not in the list anymore', async () => {
    await renderModal('/linked-servers/delete/unknown-server');

    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
    expect(screen.getByTestId('linked-servers')).toBeInTheDocument();
    expect(mockedDeleteBackupServer).not.toHaveBeenCalled();
  });
});
