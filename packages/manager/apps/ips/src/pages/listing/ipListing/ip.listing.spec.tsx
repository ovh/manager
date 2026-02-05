import { describe, it } from 'vitest';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { urls } from '@/routes/routes.constant';
import { getButtonByIcon, renderTest } from '@/test-utils';

describe('IP Listing Page', () => {
  it('should render a datagrid', async () => {
    const { container } = await renderTest({
      nbIp: 6,
      initialRoute: urls.listing,
    });
    await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
      nth: 1,
    });
  });
});
