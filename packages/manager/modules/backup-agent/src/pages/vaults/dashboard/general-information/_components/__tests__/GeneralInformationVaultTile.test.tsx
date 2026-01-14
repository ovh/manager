import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { GeneralInformationTileProps } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { mockLocations } from '@/mocks/location/locations';
import { mockVaults } from '@/mocks/vaults/vaults.mock';

import { GeneralInformationVaultTile } from '../general-information-vault-tile/GeneralInformationVaultTile.component';

const { useBackupVaultDetailsMock, useLocationDetailsMock } = vi.hoisted(() => ({
  useBackupVaultDetailsMock: vi.fn(),
  useLocationDetailsMock: vi.fn(),
}));

vi.mock('@/data/hooks/location/getLocationDetails', () => ({
  useLocationDetails: useLocationDetailsMock,
}));
vi.mock('@/data/hooks/vaults/getVaultDetails', () => ({
  useBackupVaultDetails: useBackupVaultDetailsMock,
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

describe('GeneralInformationVaultTile', () => {
  it('Should render GeneralInformationVaultTile component', async () => {
    useBackupVaultDetailsMock.mockReturnValue({ data: mockVaults[0]!, isLoading: false });
    useLocationDetailsMock.mockReturnValue({ data: mockLocations[0]!, isLoading: false });
    const { container } = render(<GeneralInformationVaultTile vaultId={mockVaults[0]!.id} />);

    await expect(container).toBeAccessible();

    expect(screen.getByText(mockVaults[0]!.currentState.name)).toBeVisible();
  });

  it('Should render GeneralInformationVaultTile component', async () => {
    useBackupVaultDetailsMock.mockReturnValue({ data: mockVaults[0]!, isLoading: true });
    useLocationDetailsMock.mockReturnValue({ data: mockLocations[0]!, isLoading: true });
    const { container } = render(<GeneralInformationVaultTile vaultId={mockVaults[0]!.id} />);

    await expect(container).toBeAccessible();

    expect(container.querySelectorAll('ods-skeleton').length).toBeGreaterThanOrEqual(1);
  });
});
