import { describe, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { UseMutationResult } from '@tanstack/react-query';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import AddOIDCProvider from '@/pages/oidc-provider/AddOIDCProvider.page';
import { wrapper } from '@/wrapperRenders';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';

type AddOIDCProviderPageReturnType = UseMutationResult<
  never,
  Error,
  void,
  unknown
> & { addOidcProvider: () => void };

describe('AddOIDCProviderPage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useAddOidcProvider').mockReturnValue(({
      isPending: true,
      addOidcProvider: vi.fn(),
    } as unknown) as AddOIDCProviderPageReturnType);
    const { getByTestId } = render(<AddOIDCProvider />, { wrapper });
    expect(getByTestId('addOIDCProvider-spinner')).toBeVisible();
  });

  it('renders add OIDC provider content when data is available', () => {
    vi.spyOn(useKubernetesModule, 'useAddOidcProvider').mockReturnValue(({
      isPending: false,
      addOidcProvider: vi.fn(),
    } as unknown) as AddOIDCProviderPageReturnType);
    const { getByText } = render(<AddOIDCProvider />, { wrapper });
    expect(
      getByText(
        /pci_projects_project_kubernetes_details_service_add_oidc_provider_description/i,
      ),
    ).toBeInTheDocument();
  });

  it('calls addOidcProvider on submit button click', () => {
    const mockAddOidcProvider = vi.fn();
    vi.spyOn(useKubernetesModule, 'useAddOidcProvider').mockReturnValue(({
      isPending: false,
      addOidcProvider: mockAddOidcProvider,
    } as unknown) as AddOIDCProviderPageReturnType);
    const { getByTestId } = render(<AddOIDCProvider />, {
      wrapper,
    });
    const clientIdInput = (getByTestId(
      'clientId-input',
    ) as unknown) as OsdsInput;
    const issuerUrlInput = (getByTestId(
      'issuerUrl-input',
    ) as unknown) as OsdsInput;
    act(() => {
      fireEvent.change(getByTestId('clientId-input'), {
        target: { value: 'VALID_ID' },
      });
      clientIdInput.odsValueChange.emit({
        value: 'VALID_ID',
      } as OdsInputValueChangeEventDetail);
    });
    act(() => {
      fireEvent.change(getByTestId('issuerUrl-input'), {
        target: { value: 'https://valid.url' },
      });
      issuerUrlInput.odsValueChange.emit({
        value: 'https://valid.url',
      } as OdsInputValueChangeEventDetail);
    });
    fireEvent.click(getByTestId('addOIDCProvider-button_submit'));
    expect(mockAddOidcProvider).toHaveBeenCalled();
  });

  it('disables submit button when add is pending', () => {
    vi.spyOn(useKubernetesModule, 'useAddOidcProvider').mockReturnValue(({
      isPending: true,
      addOidcProvider: vi.fn(),
    } as unknown) as AddOIDCProviderPageReturnType);
    const { getByTestId } = render(<AddOIDCProvider />, { wrapper });
    expect(getByTestId('addOIDCProvider-button_submit')).toBeDisabled();
  });

  it('displays error message when client ID is invalid', () => {
    vi.spyOn(useKubernetesModule, 'useAddOidcProvider').mockReturnValue(({
      isPending: false,
      addOidcProvider: vi.fn(),
    } as unknown) as AddOIDCProviderPageReturnType);
    const { getByTestId } = render(<AddOIDCProvider />, { wrapper });
    const clientIdInput = (getByTestId(
      'clientId-input',
    ) as unknown) as OsdsInput;
    act(() => {
      fireEvent.change(getByTestId('clientId-input'), {
        target: { value: '' },
      });
      clientIdInput.odsValueChange.emit({
        value: '',
      } as OdsInputValueChangeEventDetail);
      fireEvent.blur(getByTestId('clientId-input'));
      clientIdInput.odsInputBlur.emit();
    });
    expect(getByTestId('clientId-formfield')).toHaveAttribute(
      'error',
      'common_field_error_required',
    );
  });

  it('displays error message when issuer URL is invalid', () => {
    vi.spyOn(useKubernetesModule, 'useAddOidcProvider').mockReturnValue(({
      isPending: false,
      addOidcProvider: vi.fn(),
    } as unknown) as AddOIDCProviderPageReturnType);
    const { getByTestId } = render(<AddOIDCProvider />, { wrapper });
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
    expect(getByTestId('issuerUrl-formfield')).toHaveAttribute(
      'error',
      'common_field_error_required',
    );
  });
});
