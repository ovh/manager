import { describe, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import RemoveOIDCProvider from '@/pages/oidc-provider/RemoveOIDCProvider.page';
import { wrapper } from '@/wrapperRenders';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { TOidcProvider } from '@/api/data/kubernetes';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn().mockReturnValue({
    projectId: 'project-id',
    kubeId: 'kube-id',
  }),
  useNavigate: vi.fn(),
}));

type RemoveOIDCProviderPageReturnType = UseMutationResult<
  never,
  Error,
  void,
  unknown
> & { removeOidcProvider: () => void };

describe('RemoveOIDCProviderPage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TOidcProvider>);
    const { getByTestId } = render(<RemoveOIDCProvider />, { wrapper });
    expect(getByTestId('addOIDCProvider-spinner')).toBeVisible();
  });

  it('renders remove OIDC provider content when data is available', () => {
    vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
      isPending: false,
      data: { clientId: 'test-client-id' },
    } as UseQueryResult<TOidcProvider>);
    const { getByText } = render(<RemoveOIDCProvider />, { wrapper });
    expect(
      getByText(
        /pci_projects_project_kubernetes_details_service_remove_oidc_provider_description/i,
      ),
    ).toBeInTheDocument();
  });

  it('calls removeOidcProvider on confirm button click', () => {
    const mockRemoveOidcProvider = vi.fn();
    vi.spyOn(useKubernetesModule, 'useRemoveOidcProvider').mockReturnValue(({
      removeOidcProvider: mockRemoveOidcProvider,
      isPending: false,
    } as unknown) as RemoveOIDCProviderPageReturnType);
    const { getByTestId } = render(<RemoveOIDCProvider />, { wrapper });
    fireEvent.click(getByTestId('removeOIDCProvider-button_submit'));
    expect(mockRemoveOidcProvider).toHaveBeenCalled();
  });

  it('disables confirm button when removal is pending', () => {
    vi.spyOn(useKubernetesModule, 'useRemoveOidcProvider').mockReturnValue(({
      removeOidcProvider: vi.fn(),
      isPending: true,
    } as unknown) as RemoveOIDCProviderPageReturnType);
    const { getByTestId } = render(<RemoveOIDCProvider />, { wrapper });
    expect(getByTestId('removeOIDCProvider-button_submit')).toBeDisabled();
  });
});
