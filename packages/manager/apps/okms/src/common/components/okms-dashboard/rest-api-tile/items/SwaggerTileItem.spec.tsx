import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { LinkType, LinksProps } from '@ovh-ux/manager-react-components';

import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { SWAGGER_UI_LABEL } from '@/constants';

import { SwaggerTileItem } from './SwaggerTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    Links: ({ onClickReturn, ...rest }: LinksProps) => (
      <a data-testid={'swagger-link'} onClick={onClickReturn} {...rest} />
    ),
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
