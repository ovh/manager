import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { ENDPOINT_RSA_LABEL } from '@/constants';
import { getOdsClipboardByValue } from '@/utils/tests/uiTestHelpers';
import {
  DownloadOkmsPublicCaLink,
  DownloadOkmsPublicCaLinkProps,
} from '@/common/components/downloadOkmsPublicCaLink/DownloadOkmsPublicCaLink';
import { KmipEndpointRsaTileItem } from './KmipEndpointRsaTileItem.component';
import { renderWithI18n } from '@/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

vi.mock(
  '@/common/components/downloadOkmsPublicCaLink/DownloadOkmsPublicCaLink',
  async (original) => ({
    ...(await original()),
    DownloadOkmsPublicCaLink: vi.fn(),
  }),
);

describe('OKMS Kmip endpoint RSA Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    const { container } = await renderWithI18n(
      <KmipEndpointRsaTileItem okms={okmsMocked} />,
    );

    // THEN
    expect(screen.getByText(ENDPOINT_RSA_LABEL)).toBeVisible();

    expect(
      getOdsClipboardByValue({ container, value: okmsMocked.kmipRsaEndpoint }),
    ).toBeVisible();

    expect(DownloadOkmsPublicCaLink).toHaveBeenCalledTimes(1);
    expect(vi.mocked(DownloadOkmsPublicCaLink).mock.calls[0][0]).toEqual<
      DownloadOkmsPublicCaLinkProps
    >({
      okms: okmsMocked,
      type: 'publicCaRsaKmip',
    });
  });
});
