import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { getButtonByIcon, getButtonByLabel } from '@/test-utils/uiTestHelpers';
import TagsListActions from './TagsListActions.component';
import { IamTagListItem, TagType } from '@/data/api/get-iam-tags';

/** RENDER */
const renderComponent = (item: IamTagListItem) => {
  return render(<TagsListActions {...item} />);
};

describe('TagListActionsCell Component', async () => {
  it('Should display action menu with assign button', async () => {
    const { container } = renderComponent({
      name: 'env:prod',
      count: 1,
      type: TagType.CUSTOM_TAG,
    });

    const menuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });

    fireEvent.click(menuButton);

    const assignButton = await getButtonByLabel({
      container,
      label: 'assignToResources',
    });

    fireEvent.click(assignButton);
  });

  it('Should display action menu with manage resources button', async () => {
    const { container } = renderComponent({
      name: 'env:prod',
      count: 1,
      type: TagType.CUSTOM_TAG,
    });
    const menuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });

    fireEvent.click(menuButton);

    const manageResourcesButton = await getButtonByLabel({
      container,
      label: 'manageResources',
    });

    fireEvent.click(manageResourcesButton);

    // Todo: Finish this test when manage resources action is done
  });
});
