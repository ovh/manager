import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { getOdsClipboardByValue } from '@/utils/tests/uiTestHelpers';
import { ENPOINT_LABEL } from '@/constants';
import { RestApiEndpointTileItem } from './RestApiEndpointTileItem.component';
import {
  DownloadOkmsPublicCaLink,
  DownloadOkmsPublicCaLinkParams,
} from '@/common/components/downloadOkmsPublicCaLink/DownloadOkmsPublicCaLink';
import { renderWithI18n } from '@/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

vi.mock(
  '@/common/components/downloadOkmsPublicCaLink/DownloadOkmsPublicCaLink',
  async (original) => ({
    ...(await original()),
    DownloadOkmsPublicCaLink: vi.fn(),
  }),
);

describe('OKMS Rest API endpoint Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    const { container } = await renderWithI18n(
      <RestApiEndpointTileItem okms={okmsMocked} />,
    );

    // THEN
    expect(screen.getByText(ENPOINT_LABEL)).toBeVisible();
    expect(
      getOdsClipboardByValue({ container, value: okmsMocked.restEndpoint }),
    ).toBeVisible();

    expect(DownloadOkmsPublicCaLink).toHaveBeenCalledTimes(1);
    expect(vi.mocked(DownloadOkmsPublicCaLink).mock.calls[0][0]).toEqual<
      DownloadOkmsPublicCaLinkParams
    >({
      okms: okmsMocked,
      type: 'publicCaRest',
    });
  });
});
