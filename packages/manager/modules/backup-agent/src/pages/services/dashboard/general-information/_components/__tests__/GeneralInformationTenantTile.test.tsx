import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { GeneralInformationTileProps } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';

import { GeneralInformationTenantTile } from '../general-information-tenant-tile/GeneralInformationTenantTile.component';

vi.mock('react-router-dom', () => ({
  useHref: vi.fn().mockImplementation((url: string) => url),
}));

const { useBackupVSPCTenantDetailsMock } = vi.hoisted(() => ({
  useBackupVSPCTenantDetailsMock: vi.fn(),
}));

vi.mock('@/data/hooks/tenants/useVspcTenantDetails', () => ({
  useBackupVSPCTenantDetails: useBackupVSPCTenantDetailsMock,
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
  it('Should render GeneralInformationTenantTile component', async () => {
    useBackupVSPCTenantDetailsMock.mockReturnValue({ data: TENANTS_MOCKS[0]!, isPending: false });
    const { container } = render(<GeneralInformationTenantTile tenantId={TENANTS_MOCKS[0]!.id} />);

    await expect(container).toBeAccessible();

    expect(screen.getByText(TENANTS_MOCKS[0]!.currentState.name)).toBeVisible();
  });

  it('Should render GeneralInformationTenantTile component', async () => {
    useBackupVSPCTenantDetailsMock.mockReturnValue({ data: TENANTS_MOCKS[0]!, isPending: true });
    const { container } = render(<GeneralInformationTenantTile tenantId={TENANTS_MOCKS[0]!.id} />);

    await expect(container).toBeAccessible();

    expect(screen.getByText('is loading')).toBeVisible();
  });
});
