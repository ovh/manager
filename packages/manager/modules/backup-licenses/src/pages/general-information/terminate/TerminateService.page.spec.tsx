import React from 'react';

import { Outlet, Route, Routes } from 'react-router-dom';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';

import type { ModalProps } from '@ovh-ux/manager-react-components';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { BackupLicenseResource } from '@/types/BackupLicense.type';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';

import TerminateServicePage from './TerminateService.page';

vi.mock('@/data/api/tenants/tenants.requests');
vi.mock('@/data/api/backupLicenses/backupLicenses.requests');

const { addSuccess, addError, terminateServiceMock, useNavigationGetUrlMock, outcomeRef } =
  vi.hoisted(() => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
    terminateServiceMock: vi.fn(),
    useNavigationGetUrlMock: vi
      .fn()
      .mockReturnValue({ data: 'https://manager.eu.ovhcloud.com/#/hub/' }),
    outcomeRef: { current: 'success' as 'success' | 'error' },
  }));

// `Modal` est un web component ODS sous le capot : on le remplace par un rendu DOM simple,
// même convention que DeleteBackupServer.page.spec.tsx.
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useNotifications: () => ({ addSuccess, addError }),
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

// `useDeleteService` appelle `environment.getUser()` sans ShellContext.Provider dédié dans les
// tests du module : on le remplace, plutôt que de fournir un contexte complet pour un seul test.
vi.mock('@ovh-ux/manager-module-common-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-module-common-api')>();
  return {
    ...actual,
    useDeleteService: (options: Record<string, unknown>) => ({
      terminateService: (params: unknown) => {
        terminateServiceMock(params);
        const onSuccess = options.onSuccess as (() => void) | undefined;
        const onError = options.onError as (() => void) | undefined;
        const onSettled = options.onSettled as (() => void) | undefined;
        if (outcomeRef.current === 'error') {
          onError?.();
        } else {
          onSuccess?.();
        }
        onSettled?.();
      },
      isPending: false,
    }),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-shell-client')>();
  return { ...actual, useNavigationGetUrl: useNavigationGetUrlMock };
});

const originalLocation = window.location;

// La modale est une route enfant de « General information » : on reproduit cette imbrication
// pour que `navigate('..')` se comporte comme en vrai.
const renderModal = () =>
  renderWithProviders(
    <Routes>
      <Route
        path="/general-information"
        element={
          <div data-testid="general-information">
            <Outlet />
          </div>
        }
      >
        <Route path="terminate" element={<TerminateServicePage />} />
      </Route>
    </Routes>,
    { initialEntries: ['/general-information/terminate'] },
  );

describe('TerminateServicePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    terminateServiceMock.mockReset();
    outcomeRef.current = 'success';
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, href: originalLocation.href },
      writable: true,
    });
    vi.mocked(getBackupServicesTenants).mockResolvedValue([
      {
        id: 'service-1',
        resourceStatus: 'READY',
        currentState: { id: 'service-1', name: 'service' },
      } as Resource<BackupServicesTenant>,
    ]);
    vi.mocked(getVspcTenants).mockResolvedValue([buildBackupLicensesVspcTenant('vspc-1')]);
    vi.mocked(getBackupLicenses).mockResolvedValue([
      {
        id: 'license-1',
        resourceStatus: 'READY',
        currentState: { id: 'license-1' },
      } as BackupLicenseResource,
    ]);
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true });
  });

  it('renders a critical modal and enables the confirmation once the resource name is known', async () => {
    await renderModal();

    expect(screen.getByTestId('modal')).toHaveAttribute('data-type', ODS_MODAL_COLOR.critical);
    await waitFor(() => expect(screen.getByTestId('modal-primary')).toBeEnabled());
  });

  it('terminates the license, notifies, and redirects to the hub on success', async () => {
    await renderModal();

    await waitFor(() => expect(screen.getByTestId('modal-primary')).toBeEnabled());
    fireEvent.click(screen.getByTestId('modal-primary'));

    expect(terminateServiceMock).toHaveBeenCalledWith({ resourceName: 'license-1' });
    await waitFor(() => expect(addSuccess).toHaveBeenCalledTimes(1));
    expect(addError).not.toHaveBeenCalled();
    expect(window.location.href).toBe('https://manager.eu.ovhcloud.com/#/hub/');
  });

  it('notifies the error and still redirects to the hub when the termination fails', async () => {
    outcomeRef.current = 'error';

    await renderModal();

    await waitFor(() => expect(screen.getByTestId('modal-primary')).toBeEnabled());
    fireEvent.click(screen.getByTestId('modal-primary'));

    await waitFor(() => expect(addError).toHaveBeenCalledTimes(1));
    expect(addSuccess).not.toHaveBeenCalled();
    expect(window.location.href).toBe('https://manager.eu.ovhcloud.com/#/hub/');
  });

  it('closes the modal without redirecting when the hub URL cannot be resolved', async () => {
    useNavigationGetUrlMock.mockReturnValue({ data: undefined });

    await renderModal();

    await waitFor(() => expect(screen.getByTestId('modal-primary')).toBeEnabled());
    fireEvent.click(screen.getByTestId('modal-primary'));

    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
    expect(screen.getByTestId('general-information')).toBeInTheDocument();
  });

  it('closes the modal on cancel', async () => {
    await renderModal();

    fireEvent.click(screen.getByTestId('modal-secondary'));

    await waitFor(() => expect(screen.queryByTestId('modal')).not.toBeInTheDocument());
    expect(screen.getByTestId('general-information')).toBeInTheDocument();
    expect(terminateServiceMock).not.toHaveBeenCalled();
  });
});
