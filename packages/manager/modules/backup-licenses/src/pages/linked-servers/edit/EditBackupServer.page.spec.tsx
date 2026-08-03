import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  editBackupServer,
  getBackupServers,
} from '@/data/api/backupServers/backupServers.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { BackupServerResource, LicenseStatus } from '@/types/BackupServer.type';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { LicenseApiValue } from '@/types/Order.type';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import EditBackupServerPage from './EditBackupServer.page';

vi.mock('@/data/api/backupServers/backupServers.requests');
vi.mock('@/data/api/tenants/tenants.requests');
// `useGuideUtils` lit `ShellContext`, absent du wrapper de test et hors périmètre de ce test :
// on court-circuite le guide, non exercé ici.
vi.mock('@/hooks/useMainGuideItem', () => ({ useMainGuideItem: () => [] }));

const { addSuccess } = vi.hoisted(() => ({ addSuccess: vi.fn() }));

// Page pleine (BaseLayout + StepComponent), pas une modale : on remplace ces composants MRC
// par un rendu DOM simple, sur le même principe que le mock de `Modal` pour la suppression
// (convention du module, cf. DeleteBackupServer.page.spec.tsx).
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useNotifications: () => ({ addSuccess, addError: vi.fn() }),
    Breadcrumb: () => null,
    ChangelogButton: () => null,
    GuideButton: () => null,
    BaseLayout: ({
      children,
      onClickReturn,
      backLinkLabel,
    }: {
      children?: React.ReactNode;
      onClickReturn?: () => void;
      backLinkLabel?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } & Record<string, any>) => (
      <div data-testid="edit-backup-server-layout">
        <button type="button" data-testid="back-link" onClick={onClickReturn}>
          {backLinkLabel}
        </button>
        {children}
      </div>
    ),
    StepComponent: ({
      order,
      title,
      isOpen,
      isLocked,
      edit,
      next,
      children,
    }: {
      order: number;
      title?: React.ReactNode;
      isOpen?: boolean;
      isLocked?: boolean;
      edit?: { action: (id: string) => void; label: string };
      next?: { action: (id: string) => void; label: string; isDisabled?: boolean };
      children?: React.ReactNode;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } & Record<string, any>) => (
      <section data-testid={`step-${order}`}>
        <div data-testid={`step-${order}-title`}>{title}</div>
        {edit?.action && isLocked && (
          <button
            type="button"
            data-testid={`step-${order}-edit`}
            onClick={() => edit.action('id')}
          >
            {edit.label}
          </button>
        )}
        {isOpen && (
          <div data-testid={`step-${order}-content`}>
            {children}
            {next?.action && (
              <button
                type="button"
                data-testid={`step-${order}-next`}
                disabled={next.isDisabled}
                onClick={() => next.action('id')}
              >
                {next.label}
              </button>
            )}
          </div>
        )}
      </section>
    ),
  };
});

// `OdsInput`/`OdsFormField` sont des web components ODS sous le capot, sans forme native pour
// `fireEvent.input`/`getByDisplayValue` (contrairement à `OdsButton`, dont le `onClick` natif
// fonctionne tel quel sur le vrai élément, cf. RegionSelector.component.spec.tsx). On les
// remplace par un rendu natif pour piloter la saisie.
vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-components/react')>();
  return {
    ...actual,
    OdsFormField: ({ children, error }: { children?: React.ReactNode; error?: string }) => (
      <div>
        {children}
        {!!error && <span>{error}</span>}
      </div>
    ),
    OdsInput: ({
      id,
      name,
      value,
      onOdsChange,
      onOdsBlur,
    }: {
      id?: string;
      name?: string;
      value?: string;
      onOdsChange?: (event: { detail: { value: string } }) => void;
      onOdsBlur?: () => void;
    }) => (
      <input
        id={id}
        name={name}
        value={value}
        onChange={(event) => onOdsChange?.({ detail: { value: event.target.value } })}
        onBlur={onOdsBlur}
      />
    ),
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
    externalIps: ['203.0.113.10/32'],
    privateIps: ['192.168.10.2/32'],
    licenseType: LicenseApiValue.VDP_PREMIUM,
    licenseStatus: LicenseStatus.INSTALLED,
  },
  currentTasks: [],
};

const renderPage = (initialEntry = `/edit/${server.id}`) =>
  renderWithProviders(
    <Routes>
      <Route path="/linked-servers" element={<div data-testid="linked-servers" />} />
      <Route path="edit/:backupServerId" element={<EditBackupServerPage />} />
    </Routes>,
    { initialEntries: [initialEntry] },
  );

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

  it('pre-fills the license step (open first) and the server fields from currentState', async () => {
    await renderPage();

    await waitFor(() => expect(screen.getByTestId('step-1-content')).toBeInTheDocument());
    expect(screen.queryByTestId('step-2-content')).not.toBeInTheDocument();
    const familyGroup = screen.getByRole('radiogroup', { name: 'step.license_type.label' });
    expect(familyGroup.querySelector('[role="radio"][aria-checked="true"]')).toHaveTextContent(
      'license.data_platform.title',
    );
  });

  it('reveals the server fields step once the license step is validated', async () => {
    await renderPage();

    await waitFor(() => expect(screen.getByTestId('step-1-next')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('step-1-next'));

    expect(screen.getByTestId('step-2-content')).toBeInTheDocument();
    expect(screen.getByDisplayValue('VBR-CUST-SERV-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('203.0.113.10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('192.168.10.2')).toBeInTheDocument();
  });

  it('does not reset the server fields when re-editing the license step (independent domains)', async () => {
    await renderPage();

    await waitFor(() => expect(screen.getByTestId('step-1-next')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('step-1-next'));
    fireEvent.input(screen.getByDisplayValue('VBR-CUST-SERV-01'), {
      target: { value: 'new-name' },
    });

    fireEvent.click(screen.getByTestId('step-1-edit'));
    fireEvent.click(screen.getByRole('radio', { name: /license.enterprise_plus.title/ }));

    // L'étape ② n'a jamais été refermée en rouvrant l'étape ① (domaines indépendants) : la
    // saisie y reste visible sans avoir à la rouvrir explicitement.
    expect(screen.getByDisplayValue('new-name')).toBeInTheDocument();
  });

  it('shows the deferred license message only when the selection differs from the installed one', async () => {
    await renderPage();
    await waitFor(() => expect(screen.getByTestId('step-1-content')).toBeInTheDocument());

    expect(screen.queryByText('edit.license_change_notice')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: /license.enterprise_plus.title/ }));

    expect(screen.getByText('edit.license_change_notice')).toBeInTheDocument();
  });

  it('shows the before/after recap only once a field has changed', async () => {
    await renderPage();

    await waitFor(() => expect(screen.getByTestId('step-1-next')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('step-1-next'));

    expect(screen.queryByTestId('edit-backup-server-changes-recap')).not.toBeInTheDocument();

    fireEvent.input(screen.getByDisplayValue('VBR-CUST-SERV-01'), {
      target: { value: 'new-name' },
    });

    expect(screen.getByTestId('edit-backup-server-changes-recap')).toBeInTheDocument();
  });

  it('saves the server, notifies and navigates back to the list on success', async () => {
    await renderPage();
    await waitFor(() => expect(screen.getByTestId('step-1-content')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('edit-backup-server-save'));

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
    await waitFor(() => expect(screen.getByTestId('linked-servers')).toBeInTheDocument());
  });

  it('shows the error inside the recap panel and stays on the page when the save fails', async () => {
    mockedEditBackupServer.mockRejectedValue(new Error('boom'));

    await renderPage();
    await waitFor(() => expect(screen.getByTestId('step-1-content')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('edit-backup-server-save'));

    await waitFor(() => expect(screen.getByTestId('edit-backup-server-error')).toBeInTheDocument());
    expect(addSuccess).not.toHaveBeenCalled();
    expect(screen.queryByTestId('linked-servers')).not.toBeInTheDocument();
  });

  it('redirects to the list once the server is not found in the loaded list anymore', async () => {
    await renderPage('/edit/unknown-server');

    await waitFor(() => expect(screen.getByTestId('linked-servers')).toBeInTheDocument());
    expect(mockedEditBackupServer).not.toHaveBeenCalled();
  });
});
