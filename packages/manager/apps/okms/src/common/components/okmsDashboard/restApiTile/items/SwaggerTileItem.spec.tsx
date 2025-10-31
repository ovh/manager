import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { LinksProps, LinkType } from '@ovh-ux/manager-react-components';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { SWAGGER_UI_LABEL } from '@/constants';
import { SwaggerTileItem } from './SwaggerTileItem.component';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...actual,
    Links: ({ onClickReturn, ...rest }: LinksProps) => (
      <a data-testid={'swagger-link'} onClick={onClickReturn} {...rest} />
    ),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();

  return {
    ...mod,
    useOvhTracking: () => ({ trackClick: vi.fn() }),
  };
});

describe('OKMS Swagger Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<SwaggerTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(SWAGGER_UI_LABEL)).toBeVisible();

    const swaggerLink = screen.getByTestId('swagger-link');

    expect(swaggerLink).toBeVisible();
    expect(swaggerLink).toHaveAttribute('label', okmsMocked.swaggerEndpoint);
    expect(swaggerLink).toHaveAttribute('href', okmsMocked.swaggerEndpoint);
    expect(swaggerLink).toHaveAttribute('target', '_blank');
    expect(swaggerLink).toHaveAttribute('type', LinkType.external);
  });
});
