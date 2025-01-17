import { describe, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import AddOIDCProvider, { AddOIDCProviderPage } from './AddOIDCProvider.page';
import { wrapper } from '@/wrapperRenders';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { TOidcProvider } from '@/api/data/kubernetes';
import { OidcFormValues } from '@/types';

type AddOIDCProviderPageReturnType = UseMutationResult<
  never,
  Error,
  OidcFormValues,
  unknown
> & { upsertOidcProvider: (params: OidcFormValues) => void };

describe('AddOIDCProviderPage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useUpsertOidcProvider').mockReturnValue(({
      isPending: true,
      isUpdate: false,
    } as unknown) as AddOIDCProviderPageReturnType);
    const { getByTestId } = render(<AddOIDCProviderPage />, { wrapper });
    expect(getByTestId('addOIDCProvider-spinner')).toBeVisible();
  });

  it('displays error message when issuer URL is invalid', async () => {
    vi.spyOn(useKubernetesModule, 'useUpsertOidcProvider').mockReturnValue(({
      upsertOidcProvider: vi.fn(),
      isPending: false,
    } as unknown) as AddOIDCProviderPageReturnType);
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TOidcProvider>);
    const { getByTestId } = render(<AddOIDCProviderPage />, {
      wrapper,
    });

    const issuerUrlInput = (getByTestId(
      'issuerUrl-input',
    ) as unknown) as OsdsInput;

    act(() => {
      fireEvent.change(getByTestId('issuerUrl-input'), {
        target: { value: '' },
      });
      fireEvent.blur(getByTestId('issuerUrl-input'));
      issuerUrlInput.odsValueChange.emit({
        value: '',
      } as OdsInputValueChangeEventDetail);
      issuerUrlInput.odsInputBlur.emit();
    });

    waitFor(() => {
      expect(getByTestId('issuerUrl-formfield')).toHaveAttribute(
        'error',
        'upsert-oidc-provider:pci_projects_project_kubernetes_details_service_upsert_oidc_provider_issue_url_error',
      );
    });
  });

  it('displays error message when client ID is invalid', () => {
    vi.spyOn(useKubernetesModule, 'useUpsertOidcProvider').mockReturnValue(({
      upsertOidcProvider: vi.fn(),
      isPending: false,
    } as unknown) as AddOIDCProviderPageReturnType);
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TOidcProvider>);
    const { getByTestId } = render(<AddOIDCProvider />, {
      wrapper,
    });

    const clientIdInput = (getByTestId(
      'clientId-input',
    ) as unknown) as OsdsInput;

    act(() => {
      fireEvent.change(getByTestId('clientId-input'), {
        target: { value: '' },
      });
      fireEvent.blur(getByTestId('clientId-input'));
      clientIdInput.odsValueChange.emit({
        value: '',
      } as OdsInputValueChangeEventDetail);
      clientIdInput.odsInputBlur.emit();
    });
    waitFor(() => {
      expect(getByTestId('clientId-formfield')).toHaveAttribute(
        'error',
        'common:common_field_error_required',
      );
    });
  });

  it('calls addOidcProvider when isUpdate is false', async () => {
    const mockuseUpsertOidcProvider = vi.fn();
    vi.spyOn(useKubernetesModule, 'useUpsertOidcProvider').mockReturnValue(({
      upsertOidcProvider: mockuseUpsertOidcProvider,
      isPending: false,
      isUpdate: false,
      data: { clientId: '', issuerUrl: '' },
    } as unknown) as AddOIDCProviderPageReturnType);
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: false,
      data: { clientId: '', issuerUrl: '' },
    } as UseQueryResult<TOidcProvider>);

    const { getByTestId } = render(<AddOIDCProvider />, {
      wrapper,
    });

    waitFor(() => {
      expect(getByTestId('"addOIDCProvider-button_submit')).toHaveAttribute(
        'add-oidc-provider:pci_projects_project_kubernetes_details_service_add_oidc_provider_action_add',
      );
    });
  });
});
