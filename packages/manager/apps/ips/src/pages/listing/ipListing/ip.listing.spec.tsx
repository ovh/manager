import { describe, it } from 'vitest';

import { ICON_NAME } from '@ovhcloud/ods-react';

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
      iconName: ICON_NAME.ellipsisVertical,
      nth: 1,
    });
  });
});
