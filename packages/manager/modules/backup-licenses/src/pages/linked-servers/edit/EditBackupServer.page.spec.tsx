import React from 'react';

import { Outlet, Route, Routes } from 'react-router-dom';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ModalProps } from '@ovh-ux/manager-react-components';

import {
  editBackupServer,
  getBackupServers,
} from '@/data/api/backupServers/backupServers.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { BackupServerResource } from '@/types/BackupServer.type';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { LicenseApiValue } from '@/types/Order.type';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import EditBackupServerPage from './EditBackupServer.page';

vi.mock('@/data/api/backupServers/backupServers.requests');
vi.mock('@/data/api/tenants/tenants.requests');

const { addSuccess } = vi.hoisted(() => ({ addSuccess: vi.fn() }));

// `Modal` est un web component ODS sous le capot : on le remplace par un rendu DOM simple, ce
// qui permet d'asserter exactement ce que la page lui passe (convention du module, cf.
// DeleteBackupServer.page.spec.tsx).
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useNotifications: () => ({ addSuccess, addError: vi.fn() }),
    Modal: ({
      heading,
      primaryLabel,
      onPrimaryButtonClick,
      isPrimaryButtonLoading,
      isPrimaryButtonDisabled,
      secondaryLabel,
      onSecondaryButtonClick,
      children,
    }: ModalProps) => (
      <div data-testid="modal">
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

// `OdsFormField`/`OdsInput` sont des web components Stencil : on les remplace par des éléments
// HTML natifs qui reproduisent leur contrat d'événements (`onOdsChange` avec un `detail.value`),
// sur le modèle déjà utilisé côté `backup-agent` (`AgentDownload.test.tsx`).
vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-components/react')>();
  return {
    ...actual,
    OdsFormField: ({ children, error }: { children: React.ReactNode; error?: string }) => (
      <div>
        {children}
        {!!error && <span data-testid="field-error">{error}</span>}
      </div>
    ),
    OdsInput: ({
      id,
      value,
      onOdsChange,
      onOdsBlur,
    }: {
      id: string;
      value: string;
      onOdsChange: (event: { detail: { value: string } }) => void;
      onOdsBlur?: () => void;
    }) => (
      <input
        id={id}
        value={value}
        onChange={(event) => onOdsChange({ detail: { value: event.target.value } })}
        onBlur={onOdsBlur}
      />
    ),
    OdsMessage: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    OdsText: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    // `OdsAccordion` repose sur `<details>/<summary>` : non hydraté en jsdom (custom element
    // Stencil sans shadow DOM ici), donc pas de toggle natif observable au clic. On le remplace
    // par un en-tête cliquable qui reproduit son contrat (`isOpen`/`onOdsToggle`), sur le modèle
    // du `Modal` ci-dessus.
    OdsAccordion: ({
      children,
      isOpen,
      onOdsToggle,
      ...rest
    }: {
      children: React.ReactNode;
      isOpen?: boolean;
      onOdsToggle?: (event: { detail: { isOpen: boolean } }) => void;
    } & Record<string, unknown>) => {
      const items = React.Children.toArray(children) as React.ReactElement[];
      const summary = items.find((child) => child.props?.slot === 'summary');
      const content = items.filter((child) => child !== summary);
      return (
        <div>
          <button
            type="button"
            {...rest}
            onClick={() => onOdsToggle?.({ detail: { isOpen: !isOpen } })}
          >
            {summary}
          </button>
          {content}
        </div>
      );
    },
  };
});

const mockedEditBackupServer = vi.mocked(editBackupServer);
const mockedGetBackupServers = vi.mocked(getBackupServers);

const server: BackupServerResource = {
  id: 'server-1',
  status: 'ENABLED',
  currentState: {
    id: 'server-1',
    displayName: 'VBR-CUST-SERV-01',
    licenseType: LicenseApiValue.VDP_PREMIUM,
    externalIps: ['203.0.113.10/32'],
    privateIps: ['192.168.10.2/32'],
  },
  currentTasks: [],
};

// La modale est une route enfant de la liste : on reproduit cette imbrication pour que
// `useParams` et la fermeture par `navigate('..')` se comportent comme en vrai.
const renderModal = (initialEntry = `/linked-servers/edit/${server.id}`) =>
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
        <Route path="edit/:backupServerId" element={<EditBackupServerPage />} />
      </Route>
    </Routes>,
    { initialEntries: [initialEntry] },
  );

// Les accordéons de licence n'ont pas de data-testid dédié : on retrouve chaque carte par son
// titre (clé i18n brute, cf. NB ci-dessous) puis on remonte à l'en-tête cliquable qui la porte
// (le mock `OdsAccordion` ci-dessus, qui reflète `selected` via `aria-current`).
const getCardButton = (titleKey: string) => screen.getByText(titleKey).closest('button')!;

// NB : le harness i18n du module ne résout pas les libellés — `t(key)` renvoie la clé, d'où les
// regex/clés brutes plutôt que du texte traduit (cf. LicenseTypeCell.component.spec.tsx).
describe('EditBackupServerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetBackupServers.mockResolvedValue([server]);
    mockedEditBackupServer.mockResolvedValue(undefined);
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

  it('prefills the form from the current state of the server', async () => {
    await renderModal();

    expect(await screen.findByLabelText(/edit\.field\.name\.label/)).toHaveValue(
      'VBR-CUST-SERV-01',
    );
    expect(screen.getByLabelText(/edit\.field\.public_ip\.label/)).toHaveValue('203.0.113.10');
    expect(screen.getByLabelText(/edit\.field\.private_ip\.label/)).toHaveValue('192.168.10.2');
    // Licence installée = VDP_PREMIUM : famille Data Platform + niveau Premium cochés.
    expect(getCardButton('license.data_platform.title')).toHaveAttribute('aria-current', 'true');
    expect(getCardButton('license.enterprise_plus.title')).not.toHaveAttribute('aria-current');
    expect(getCardButton('tier.premium.title')).toHaveAttribute('aria-current', 'true');
  });

  it('shows no changes recap right after opening', async () => {
    await renderModal();
    await screen.findByLabelText(/edit\.field\.name\.label/);

    expect(screen.queryByTestId('edit-backup-server-changes-recap')).not.toBeInTheDocument();
  });

  it('shows the changes recap once a field is edited', async () => {
    await renderModal();
    await screen.findByLabelText(/edit\.field\.name\.label/);

    fireEvent.change(screen.getByLabelText(/edit\.field\.name\.label/), {
      target: { value: 'new-name' },
    });

    expect(screen.getByTestId('edit-backup-server-changes-recap')).toBeInTheDocument();
  });

  it('shows the deferred license change notice once a different tier is selected', async () => {
    await renderModal();
    await screen.findByLabelText(/edit\.field\.name\.label/);

    expect(screen.queryByTestId('edit-backup-server-license-notice')).not.toBeInTheDocument();

    fireEvent.click(getCardButton('tier.advanced.title'));

    expect(screen.getByTestId('edit-backup-server-license-notice')).toBeInTheDocument();
    expect(getCardButton('tier.advanced.title')).toHaveAttribute('aria-current', 'true');
    expect(getCardButton('tier.premium.title')).not.toHaveAttribute('aria-current');
  });

  it('hides the VDP tier cards once Enterprise Plus is selected', async () => {
    await renderModal();
    await screen.findByLabelText(/edit\.field\.name\.label/);

    fireEvent.click(getCardButton('license.enterprise_plus.title'));

    expect(screen.queryByText('tier.premium.title')).not.toBeInTheDocument();
    expect(screen.getByTestId('edit-backup-server-license-notice')).toBeInTheDocument();
  });

  it('restores the recommended tier when switching back to Data Platform', async () => {
    await renderModal();
    await screen.findByLabelText(/edit\.field\.name\.label/);

    fireEvent.click(getCardButton('license.enterprise_plus.title'));
    fireEvent.click(getCardButton('license.data_platform.title'));

    expect(getCardButton('tier.premium.title')).toHaveAttribute('aria-current', 'true');
  });

  it('edits the server, notifies and closes the modal on success', async () => {
    await renderModal();
    await screen.findByLabelText(/edit\.field\.name\.label/);

    fireEvent.click(screen.getByTestId('modal-primary'));

    await waitFor(() => expect(addSuccess).toHaveBeenCalledTimes(1));
    expect(mockedEditBackupServer).toHaveBeenCalledWith({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
      backupServerId: 'server-1',
      displayName: 'VBR-CUST-SERV-01',
      licenseType: LicenseApiValue.VDP_PREMIUM,
      externalIps: ['203.0.113.10'],
      privateIps: ['192.168.10.2'],
    });
    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
    expect(screen.getByTestId('linked-servers')).toBeInTheDocument();
  });

  it('keeps the modal open and shows the error inside it when the edition fails', async () => {
    mockedEditBackupServer.mockRejectedValue(new Error('boom'));

    await renderModal();
    await screen.findByLabelText(/edit\.field\.name\.label/);

    fireEvent.click(screen.getByTestId('modal-primary'));

    await waitFor(() => expect(screen.getByTestId('edit-backup-server-error')).toBeInTheDocument());
    expect(addSuccess).not.toHaveBeenCalled();
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('shows a spinner on the submit button while the edition is in flight', async () => {
    mockedEditBackupServer.mockReturnValue(new Promise(() => {}));

    await renderModal();
    await screen.findByLabelText(/edit\.field\.name\.label/);

    fireEvent.click(screen.getByTestId('modal-primary'));

    await waitFor(() =>
      expect(screen.getByTestId('modal-primary')).toHaveAttribute('data-loading', 'true'),
    );
  });

  it('disables the submit button once the form becomes invalid', async () => {
    await renderModal();
    await screen.findByLabelText(/edit\.field\.name\.label/);

    expect(screen.getByTestId('modal-primary')).toBeEnabled();

    fireEvent.change(screen.getByLabelText(/edit\.field\.name\.label/), { target: { value: '' } });

    expect(screen.getByTestId('modal-primary')).toBeDisabled();
  });

  it('closes itself when the server is not in the list anymore', async () => {
    await renderModal('/linked-servers/edit/unknown-server');

    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
    expect(screen.getByTestId('linked-servers')).toBeInTheDocument();
    expect(mockedEditBackupServer).not.toHaveBeenCalled();
  });
});
