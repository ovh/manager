import { describe, it } from 'vitest';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { getButtonByIcon, renderTest } from '@/test-utils';
import { urls } from '@/routes/routes.constant';

describe('Manage Organisations Page', () => {
  it('should render a datagrid', async () => {
    const { container } = await renderTest({
      nbOrganisation: 3,
      initialRoute: urls.manageOrganisations,
    });

    await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
      nth: 1,
    });
  });
});
