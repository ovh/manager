import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { mockLocations } from '@/mocks/location/locations';
import { mockVaults } from '@/mocks/vaults/vaults.mock';

import { GeneralInformationTile } from '../GeneralInformationTile.component';

const TILE_TITLE = `${NAMESPACES.DASHBOARD}:general_information`;
const LABELS_VISIBLES = [
  `${NAMESPACES.DASHBOARD}:name`,
  `${NAMESPACES.STATUS}:status`,
  `${NAMESPACES.REGION}:localisation`,
  `${NAMESPACES.REGION}:region`,
];

const { useBackupVaultDetailsMock, useLocationDetailsMock } = vi.hoisted(() => ({
  useBackupVaultDetailsMock: vi.fn(),
  useLocationDetailsMock: vi.fn(),
}));

vi.mock('@/data/hooks/location/getLocationDetails', () => ({
  useLocationDetails: useLocationDetailsMock,
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key: string) => key),
  }),
}));

describe('GeneralInformationTile', () => {
  it('Should render GeneralInformationTile component', async () => {
    useLocationDetailsMock.mockReturnValue({ data: mockLocations[0]!, isLoading: false });
    const { container } = render(
      <GeneralInformationTile resourceDetails={mockVaults[0]} isLoading={false} />,
    );

    await expect(container).toBeAccessible();

    [TILE_TITLE, ...LABELS_VISIBLES].forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });
  });

  it('Should render GeneralInformationTile component', async () => {
    useBackupVaultDetailsMock.mockReturnValue({ data: mockVaults[0]!, isLoading: true });
    useLocationDetailsMock.mockReturnValue({ data: mockLocations[0]!, isLoading: true });
    const { container } = render(
      <GeneralInformationTile resourceDetails={mockVaults[0]} isLoading={true} />,
    );

    await expect(container).toBeAccessible();

    [TILE_TITLE, ...LABELS_VISIBLES].forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });

    expect(container.querySelectorAll('ods-skeleton').length).toBeGreaterThanOrEqual(
      LABELS_VISIBLES.length,
    );
  });
});
