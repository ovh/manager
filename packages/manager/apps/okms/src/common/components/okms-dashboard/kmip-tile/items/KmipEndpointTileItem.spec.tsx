import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import {
  DownloadOkmsPublicCaLink,
  DownloadOkmsPublicCaLinkProps,
} from '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink';
import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { getOdsClipboardByValue } from '@/common/utils/tests/uiTestHelpers';
import { ENPOINT_LABEL } from '@/constants';

import { KmipEndpointTileItem } from './KmipEndpointTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

vi.mock(
  '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink',
  async (original) => ({
    ...(await original()),
    DownloadOkmsPublicCaLink: vi.fn(),
  }),
);

describe('OKMS Kmip endpoint Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    const { container } = await renderWithI18n(<KmipEndpointTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(ENPOINT_LABEL)).toBeVisible();

    expect(getOdsClipboardByValue({ container, value: okmsMocked.kmipEndpoint })).toBeVisible();

    expect(DownloadOkmsPublicCaLink).toHaveBeenCalledTimes(1);
    expect(
      vi.mocked(DownloadOkmsPublicCaLink).mock.calls[0]?.[0],
    ).toEqual<DownloadOkmsPublicCaLinkProps>({
      okms: okmsMocked,
      type: 'publicCaKmip',
    });
  });
});
