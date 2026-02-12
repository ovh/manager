import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { queryKeys } from '@/data/queries/queryKeys';
import { mockLocations } from '@/mocks/location/locations';
import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

import { GeneralInformationTile } from '../GeneralInformationTile.component';

const TILE_TITLE = `${NAMESPACES.DASHBOARD}:general_information`;
const LABELS_VISIBLES = [
  `${NAMESPACES.DASHBOARD}:name`,
  `${NAMESPACES.STATUS}:status`,
  `${NAMESPACES.REGION}:localisation`,
  `${NAMESPACES.REGION}:region`,
];

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key: string) => key),
  }),
}));

describe('GeneralInformationTile', () => {
  let queryClient: QueryClient;
  const vault = mockVaults[0]!;
  const region = vault.currentState.region;

  const buildWrapper = () => testWrapperBuilder().withQueryClient(queryClient).build();

  beforeEach(() => {
    queryClient = createQueryClientTest();
    queryClient.setQueryData(queryKeys.locations.detail(region), mockLocations[0]!);
  });

  it('Should render GeneralInformationTile component', async () => {
    const wrapper = await buildWrapper();

    const { container } = render(
      <GeneralInformationTile resourceDetails={vault} isLoading={false} />,
      { wrapper },
    );

    await expect(container).toBeAccessible();

    [TILE_TITLE, ...LABELS_VISIBLES].forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });
  });

  it('Should render GeneralInformationTile component', async () => {
    const wrapper = await buildWrapper();

    const { container } = render(
      <GeneralInformationTile resourceDetails={vault} isLoading={true} />,
      { wrapper },
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
