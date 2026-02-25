import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { GeneralInformationTileProps } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { queryKeys } from '@/data/queries/queryKeys';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

import { GeneralInformationTenantTile } from '../general-information-tenant-tile/GeneralInformationTenantTile.component';

vi.mock('react-router-dom', () => ({
  useHref: vi.fn().mockImplementation((url: string) => url),
}));

vi.mock(
  '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component',
  () => ({
    GeneralInformationTile: <T extends { name: string }>({
      resourceDetails,
      isLoading,
    }: GeneralInformationTileProps<T>) =>
      isLoading ? <>is loading</> : <>{resourceDetails?.currentState.name}</>,
  }),
);

describe('GeneralInformationTenantTile', () => {
  let queryClient: QueryClient;

  const buildWrapper = () => testWrapperBuilder().withQueryClient(queryClient).build();

  beforeEach(() => {
    queryClient = createQueryClientTest();
  });

  it('Should render GeneralInformationTenantTile component', async () => {
    queryClient.setQueryData(queryKeys.tenants.vspc.detail(), TENANTS_MOCKS[0]!);

    const wrapper = await buildWrapper();

    const { container } = render(<GeneralInformationTenantTile />, { wrapper });

    await expect(container).toBeAccessible();

    expect(screen.getByText(TENANTS_MOCKS[0]!.currentState.name)).toBeVisible();
  });

  it('Should render GeneralInformationTenantTile component loading', async () => {
    // Don't seed data — query stays in pending state

    const wrapper = await buildWrapper();

    const { container } = render(<GeneralInformationTenantTile />, { wrapper });

    await expect(container).toBeAccessible();

    expect(screen.getByText('is loading')).toBeVisible();
  });
});
