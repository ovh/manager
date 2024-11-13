import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { it, vi, describe, expect } from 'vitest';
import {
  OsdsInput,
  OdsInputValueChangeEventDetail,
} from '@ovhcloud/ods-components';
import AddOrUpdateOIDCProvider, {
  OidcFormValues,
} from '@/pages/oidc-provider/AddOrUpdateOIDCProvider.page';
import { wrapper } from '@/wrapperRenders';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { TOidcProvider } from '@/api/data/kubernetes';

type AddOrUpdateOIDCProviderPageReturnType = UseMutationResult<
  never,
  Error,
  OidcFormValues,
  unknown
> & {
  addOrUpdateOidcProvider: (params: OidcFormValues) => void;
  isUpdate: boolean;
};

describe('AddOrUpdateOIDCProviderPage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TOidcProvider>);
    const { getByTestId } = render(<AddOrUpdateOIDCProvider />, { wrapper });
    expect(getByTestId('addOIDCProvider-spinner')).toBeVisible();
  });

  it('displays error message when issuer URL is invalid', async () => {
    vi.spyOn(useKubernetesModule, 'useAddOrUpdateOidcProvider').mockReturnValue(
      ({
        addOrUpdateOidcProvider: vi.fn(),
        isPending: false,
      } as unknown) as AddOrUpdateOIDCProviderPageReturnType,
    );
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TOidcProvider>);
    const { getByTestId } = render(<AddOrUpdateOIDCProvider />, {
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
        'common_field_error_required',
      );
    });
  });

  it('displays error message when client ID is invalid', () => {
    vi.spyOn(useKubernetesModule, 'useAddOrUpdateOidcProvider').mockReturnValue(
      ({
        addOrUpdateOIDCProvider: vi.fn(),
        isPending: false,
      } as unknown) as AddOrUpdateOIDCProviderPageReturnType,
    );
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TOidcProvider>);
    const { getByTestId } = render(<AddOrUpdateOIDCProvider />, {
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
        'common_field_error_required',
      );
    });
  });

  it('calls updateOidcProvider on submit button click when isUpdate is true', async () => {
    const mockuseAddOrUpdateOidcProvider = vi.fn();
    vi.spyOn(useKubernetesModule, 'useAddOrUpdateOidcProvider').mockReturnValue(
      ({
        addOrUpdateOidcProvider: mockuseAddOrUpdateOidcProvider,
        isPending: false,
        isUpdate: true,
      } as unknown) as AddOrUpdateOIDCProviderPageReturnType,
    );
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: false,
      data: { clientId: 'test-client-id', issuerUrl: 'https://test.url' },
    } as UseQueryResult<TOidcProvider>);

    const { getByTestId } = render(<AddOrUpdateOIDCProvider />, {
      wrapper,
    });

    const issuerUrlInput = (getByTestId(
      'issuerUrl-input',
    ) as unknown) as OsdsInput;
    const clientIdInput = (getByTestId(
      'clientId-input',
    ) as unknown) as OsdsInput;

    act(() => {
      issuerUrlInput.odsValueChange.emit({
        value: 'https://test.url',
      } as OdsInputValueChangeEventDetail);
      clientIdInput.odsValueChange.emit({
        value: 'test-client-id',
      } as OdsInputValueChangeEventDetail);
    });

    fireEvent.click(getByTestId('updateOIDCProvider-button_submit'));

    await waitFor(() => {
      expect(mockuseAddOrUpdateOidcProvider).toHaveBeenCalledWith({
        issuerUrl: 'https://test.url',
        clientId: 'test-client-id',
      });
    });
  });
});
