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
// (convention du module, cf. DeleteBackupServer.page.spec.tsx). `ManagerButton` fait son propre
// check IAM en interne via un import relatif (pas l'export public du package) : le mocker au
// niveau du package ne suffit pas à le piloter, on le remplace donc entièrement par un bouton
// natif — son `isDisabled` reflète simplement ce que `EditRecapPanel` lui passe déjà (fail-closed
// calculé côté composant), ce qui suffit à tester ce comportement sans dépendre du vrai hook.
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useNotifications: () => ({ addSuccess, addError: vi.fn() }),
    Breadcrumb: () => null,
    ChangelogButton: () => null,
    GuideButton: () => null,
    ManagerButton: ({
      label,
      isDisabled,
      onClick,
      'data-testid': testId,
    }: {
      label: string;
      isDisabled?: boolean;
      onClick?: () => void;
      'data-testid'?: string;
    }) => (
      <button type="button" data-testid={testId} disabled={isDisabled} onClick={onClick}>
        {label}
      </button>
    ),
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

// Version/OS = cas pleinement éditable (v13 + Windows) : les tests de restriction de licence
// (version < 13, v13 + Linux) utilisent leur propre fixture, cf. plus bas.
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
    backupServerVersion: '13.0',
    osType: 'WINDOWS',
  },
  currentTasks: [],
  iam: { id: 'server-1', urn: 'urn:v1:eu:resource:backupServices:vspc/backupLicenses/server-1' },
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
    const familyGroup = screen.getByRole('radiogroup', { name: 'Type de licence' });
    expect(familyGroup.querySelector('[role="radio"][aria-checked="true"]')).toHaveTextContent(
      'Veeam Data Platform',
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
    fireEvent.click(screen.getByRole('radio', { name: /Veeam Enterprise Plus/ }));

    // L'étape ② n'a jamais été refermée en rouvrant l'étape ① (domaines indépendants) : la
    // saisie y reste visible sans avoir à la rouvrir explicitement.
    expect(screen.getByDisplayValue('new-name')).toBeInTheDocument();
  });

  it('shows the deferred license message only when the selection differs from the installed one', async () => {
    await renderPage();
    await waitFor(() => expect(screen.getByTestId('step-1-content')).toBeInTheDocument());

    expect(
      screen.queryByText(
        "Le changement de licence prendra effet le 1er du mois prochain. D'ici là, la licence actuelle reste active.",
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: /Veeam Enterprise Plus/ }));

    expect(
      screen.getByText(
        "Le changement de licence prendra effet le 1er du mois prochain. D'ici là, la licence actuelle reste active.",
      ),
    ).toBeInTheDocument();
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

  it('disables the save button when the server has no urn yet (fail-closed)', async () => {
    mockedGetBackupServers.mockResolvedValue([{ ...server, iam: undefined }]);

    await renderPage();
    await waitFor(() => expect(screen.getByTestId('step-1-content')).toBeInTheDocument());

    expect(screen.getByTestId('edit-backup-server-save')).toBeDisabled();
  });

  it('redirects to the list once the server is not found in the loaded list anymore', async () => {
    await renderPage('/edit/unknown-server');

    await waitFor(() => expect(screen.getByTestId('linked-servers')).toBeInTheDocument());
    expect(mockedEditBackupServer).not.toHaveBeenCalled();
  });

  // Les libellés sont bien résolus dans ce test de page (contrairement au harness isolé de
  // `LicenseStep.component.spec.tsx`, cf. son commentaire en tête de fichier) : on asserte donc
  // sur le texte réel plutôt que sur la clé i18n brute.
  it('disables the whole license step and shows the version restriction for a server below VBR 13', async () => {
    mockedGetBackupServers.mockResolvedValue([
      {
        ...server,
        currentState: { ...server.currentState, backupServerVersion: '12.1' },
      },
    ]);

    await renderPage();
    await waitFor(() => expect(screen.getByTestId('step-1-content')).toBeInTheDocument());

    const familyGroup = screen.getByRole('radiogroup', { name: 'Type de licence' });
    familyGroup.querySelectorAll('[role="radio"]').forEach((radio) => expect(radio).toBeDisabled());
    expect(
      screen.getByText(
        'Le type de licence ne peut pas être modifié pour ce serveur : une mise à niveau vers VBR 13 est requise.',
      ),
    ).toBeInTheDocument();
  });

  it('locks the family cards but keeps the VDP tier cards enabled for a v13 Linux server', async () => {
    mockedGetBackupServers.mockResolvedValue([
      {
        ...server,
        currentState: { ...server.currentState, backupServerVersion: '13.0', osType: 'LINUX' },
      },
    ]);

    await renderPage();
    await waitFor(() => expect(screen.getByTestId('step-1-content')).toBeInTheDocument());

    const familyGroup = screen.getByRole('radiogroup', { name: 'Type de licence' });
    familyGroup.querySelectorAll('[role="radio"]').forEach((radio) => expect(radio).toBeDisabled());

    const tierGroup = screen.getByRole('radiogroup', { name: 'Niveau VDP' });
    tierGroup
      .querySelectorAll('[role="radio"]')
      .forEach((radio) => expect(radio).not.toBeDisabled());
    expect(
      screen.getByText(
        'Le type de licence reste fixé à Data Platform pour ce serveur : seul le niveau peut être modifié.',
      ),
    ).toBeInTheDocument();
  });

  it('does not show any license restriction for a v13 Windows server', async () => {
    await renderPage();
    await waitFor(() => expect(screen.getByTestId('step-1-content')).toBeInTheDocument());

    expect(
      screen.queryByText(
        'Le type de licence ne peut pas être modifié pour ce serveur : une mise à niveau vers VBR 13 est requise.',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Le type de licence reste fixé à Data Platform pour ce serveur : seul le niveau peut être modifié.',
      ),
    ).not.toBeInTheDocument();
    const familyGroup = screen.getByRole('radiogroup', { name: 'Type de licence' });
    familyGroup
      .querySelectorAll('[role="radio"]')
      .forEach((radio) => expect(radio).not.toBeDisabled());
  });
});
