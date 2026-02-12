import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { queryKeys } from '@/data/queries/queryKeys';
import { mockLocations } from '@/mocks/location/locations';
import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

import { GeneralInformationVaultTile } from '../general-information-vault-tile/GeneralInformationVaultTile.component';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key: string) => key),
  }),
}));

describe('GeneralInformationVaultTile', () => {
  let queryClient: QueryClient;
  const vault = mockVaults[0]!;

  const buildWrapper = () => testWrapperBuilder().withQueryClient(queryClient).build();

  beforeEach(() => {
    queryClient = createQueryClientTest();
  });

  it('Should render GeneralInformationVaultTile component', async () => {
    queryClient.setQueryData(queryKeys.vaults.detail(vault.id), vault);
    queryClient.setQueryData(
      queryKeys.locations.detail(vault.currentState.region),
      mockLocations[0]!,
    );

    const wrapper = await buildWrapper();

    const { container } = render(<GeneralInformationVaultTile vaultId={vault.id} />, { wrapper });

    await expect(container).toBeAccessible();

    expect(screen.getByText(vault.currentState.name)).toBeVisible();
  });

  it('Should render GeneralInformationVaultTile component with skeletons when loading', async () => {
    // Don't seed the cache so queries stay in loading state

    const wrapper = await buildWrapper();

    const { container } = render(<GeneralInformationVaultTile vaultId={vault.id} />, { wrapper });

    await expect(container).toBeAccessible();

    expect(container.querySelectorAll('ods-skeleton').length).toBeGreaterThanOrEqual(1);
  });
});
