import { describe, it } from 'vitest';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { getButtonByIcon, renderTest } from '@/test-utils';
import { urls } from '@/routes/routes.constant';

describe('Listing Page', async () => {
  it('should render a datagrid', async () => {
    const { container } = await renderTest({
      nbIp: 2,
      initialRoute: urls.root,
    });
    await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
      nth: 1,
    });
  });
});
