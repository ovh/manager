import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import {
  DownloadOkmsPublicCaLink,
  DownloadOkmsPublicCaLinkProps,
} from '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink';
import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { assertClipboardVisibility } from '@/common/utils/tests/uiTestHelpers';
import { ENDPOINT_RSA_LABEL } from '@/constants';

import { KmipEndpointRsaTileItem } from './KmipEndpointRsaTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

vi.mock(
  '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink',
  async (original) => ({
    ...(await original()),
    DownloadOkmsPublicCaLink: vi.fn(),
  }),
);

describe('OKMS Kmip endpoint RSA Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<KmipEndpointRsaTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(ENDPOINT_RSA_LABEL)).toBeVisible();

    await assertClipboardVisibility(okmsMocked.kmipRsaEndpoint);

    expect(DownloadOkmsPublicCaLink).toHaveBeenCalledTimes(1);
    expect(
      vi.mocked(DownloadOkmsPublicCaLink).mock.calls[0]?.[0],
    ).toEqual<DownloadOkmsPublicCaLinkProps>({
      okms: okmsMocked,
      type: 'publicCaRsaKmip',
    });
  });
});
