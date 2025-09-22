import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import RemoveOIDCProvider from '@/pages/oidc-provider/remove/RemoveOIDCProvider.page';
import { TOidcProvider } from '@/types';
import { wrapper } from '@/wrapperRenders';

type RemoveOIDCProviderPageReturnType = UseMutationResult<never, Error, void, unknown> & {
  removeOidcProvider: () => void;
};

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
    vi.spyOn(useKubernetesModule, 'useRemoveOidcProvider').mockReturnValue({
      removeOidcProvider: mockRemoveOidcProvider,
      isPending: false,
    } as unknown as RemoveOIDCProviderPageReturnType);
    const { getByTestId } = render(<RemoveOIDCProvider />, { wrapper });
    fireEvent.click(getByTestId('removeOIDCProvider-button_submit'));
    expect(mockRemoveOidcProvider).toHaveBeenCalled();
  });

  it('disables confirm button when removal is pending', () => {
    vi.spyOn(useKubernetesModule, 'useRemoveOidcProvider').mockReturnValue({
      removeOidcProvider: vi.fn(),
      isPending: true,
    } as unknown as RemoveOIDCProviderPageReturnType);
    const { getByTestId } = render(<RemoveOIDCProvider />, { wrapper });
    expect(getByTestId('removeOIDCProvider-button_submit')).toBeDisabled();
  });
});
