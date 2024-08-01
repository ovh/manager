import { act, fireEvent, render } from '@testing-library/react';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { it, vi } from 'vitest';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import UpdateOIDCProvider from '@/pages/oidc-provider/UpdateOIDCProvider.page';
import { wrapper } from '@/wrapperRenders';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { TOidcProvider } from '@/api/data/kubernetes';

type UpdateOIDCProviderPageReturnType = UseMutationResult<
  never,
  Error,
  void,
  unknown
> & { updateOidcProvider: () => void };

vi.mock('react-router-dom', () => ({
  useParams: vi.fn().mockReturnValue({
    projectId: 'project-id',
    kubeId: 'kube-id',
  }),
  useNavigate: vi.fn(),
}));

describe('UpdateOIDCProviderPage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TOidcProvider>);
    const { getByTestId } = render(<UpdateOIDCProvider />, { wrapper });
    expect(getByTestId('updateOIDCProvider-spinner')).toBeVisible();
  });

  it('renders update OIDC provider content when data is available', () => {
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: false,
      data: { clientId: 'test-client-id', issuerUrl: 'https://test.url' },
    } as UseQueryResult<TOidcProvider>);
    const { getByText } = render(<UpdateOIDCProvider />, { wrapper });
    expect(getByText(/update_oidc_provider_description/i)).toBeInTheDocument();
  });

  it('calls updateOidcProvider on submit button click', () => {
    const mockUpdateOidcProvider = vi.fn();
    vi.spyOn(useKubernetesModule, 'useUpdateOidcProvider').mockReturnValue(({
      updateOidcProvider: mockUpdateOidcProvider,
      isPending: false,
    } as unknown) as UpdateOIDCProviderPageReturnType);
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: false,
      data: { clientId: 'test-client-id', issuerUrl: 'https://test.url' },
    } as UseQueryResult<TOidcProvider>);
    const { getByTestId } = render(<UpdateOIDCProvider />, {
      wrapper,
    });
    fireEvent.click(getByTestId('updateOIDCProvider-button_submit'));
    expect(mockUpdateOidcProvider).toHaveBeenCalled();
  });

  it('disables submit button when update is pending', () => {
    vi.spyOn(useKubernetesModule, 'useUpdateOidcProvider').mockReturnValue(({
      updateOidcProvider: vi.fn(),
      isPending: true,
    } as unknown) as UpdateOIDCProviderPageReturnType);
    const { getByTestId } = render(<UpdateOIDCProvider />, { wrapper });
    expect(getByTestId('updateOIDCProvider-button_submit')).toBeDisabled();
  });

  it('displays error message when client ID is invalid', () => {
    vi.spyOn(useKubernetesModule, 'useUpdateOidcProvider').mockReturnValue(({
      updateOidcProvider: vi.fn(),
      isPending: false,
    } as unknown) as UpdateOIDCProviderPageReturnType);
    const { getByTestId } = render(<UpdateOIDCProvider />, {
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
    expect(getByTestId('clientId-formfield')).toHaveAttribute(
      'error',
      'common_field_error_required',
    );
  });

  it('displays error message when issuer URL is invalid', () => {
    vi.spyOn(useKubernetesModule, 'useUpdateOidcProvider').mockReturnValue(({
      updateOidcProvider: vi.fn(),
      isPending: false,
    } as unknown) as UpdateOIDCProviderPageReturnType);
    const { getByTestId, getByText } = render(<UpdateOIDCProvider />, {
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
    expect(getByTestId('issuerUrl-formfield')).toHaveAttribute(
      'error',
      'common_field_error_required',
    );
  });
});
