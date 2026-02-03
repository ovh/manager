import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';

import { MukLinkType } from '@/common/components/link/Link.component';
import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { SWAGGER_UI_LABEL } from '@/constants';

import { SwaggerTileItem } from './SwaggerTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

describe('OKMS Swagger Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<SwaggerTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(SWAGGER_UI_LABEL)).toBeVisible();

    const swaggerLink = screen.getByText(okmsMocked.swaggerEndpoint);

    expect(swaggerLink).toBeVisible();
    expect(swaggerLink).toHaveAttribute('href', okmsMocked.swaggerEndpoint);
    expect(swaggerLink).toHaveAttribute('target', '_blank');
    expect(swaggerLink).toHaveAttribute('type', MukLinkType.external);
  });
});
