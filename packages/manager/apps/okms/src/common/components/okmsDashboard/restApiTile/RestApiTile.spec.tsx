import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { REST_API_LABEL } from '@/constants';
import { REST_API_TILE_TEST_IDS } from './RestApiTile.constants';
import { RestApiTile } from './RestApiTile.component';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

vi.mock('./items/RestApiEndpointTileItem.component', async (original) => ({
  ...(await original()),
  RestApiEndpointTileItem: vi.fn(() => (
    <div data-testid={REST_API_TILE_TEST_IDS.restApiEndpoint} />
  )),
}));

vi.mock('./items/SwaggerTileItem.component', async (original) => ({
  ...(await original()),
  SwaggerTileItem: vi.fn(() => (
    <div data-testid={REST_API_TILE_TEST_IDS.swagger} />
  )),
}));

describe('OKMS Rest Api Tile test suite', () => {
  it('should display tile content', async () => {
    // GIVEN
    const tileItems = [
      REST_API_TILE_TEST_IDS.restApiEndpoint,
      REST_API_TILE_TEST_IDS.swagger,
    ];

    // WHEN
    await renderWithI18n(<RestApiTile okms={okmsMock[0]} />);

    // THEN
    expect(screen.getByText(REST_API_LABEL)).toBeVisible();
    tileItems.forEach((item) => {
      expect(screen.getByTestId(item)).toBeInTheDocument();
    });
  });
});
