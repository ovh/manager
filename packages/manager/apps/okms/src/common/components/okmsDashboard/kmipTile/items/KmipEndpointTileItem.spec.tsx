import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { KmipEndpointTileItem } from './KmipEndpointTileItem.component';
import { ENPOINT_LABEL } from '@/constants';
import { getOdsClipboardByValue } from '@/common/utils/tests/uiTestHelpers';
import {
  DownloadOkmsPublicCaLink,
  DownloadOkmsPublicCaLinkProps,
} from '@/common/components/downloadOkmsPublicCaLink/DownloadOkmsPublicCaLink';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

vi.mock(
  '@/common/components/downloadOkmsPublicCaLink/DownloadOkmsPublicCaLink',
  async (original) => ({
    ...(await original()),
    DownloadOkmsPublicCaLink: vi.fn(),
  }),
);

describe('OKMS Kmip endpoint Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    const { container } = await renderWithI18n(
      <KmipEndpointTileItem okms={okmsMocked} />,
    );

    // THEN
    expect(screen.getByText(ENPOINT_LABEL)).toBeVisible();

    expect(
      getOdsClipboardByValue({ container, value: okmsMocked.kmipEndpoint }),
    ).toBeVisible();

    expect(DownloadOkmsPublicCaLink).toHaveBeenCalledTimes(1);
    expect(vi.mocked(DownloadOkmsPublicCaLink).mock.calls[0][0]).toEqual<
      DownloadOkmsPublicCaLinkProps
    >({
      okms: okmsMocked,
      type: 'publicCaKmip',
    });
  });
});
