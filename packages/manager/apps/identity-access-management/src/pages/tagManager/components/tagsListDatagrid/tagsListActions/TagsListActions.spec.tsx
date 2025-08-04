import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import * as ReactRouterDom from 'react-router-dom';
import { getButtonByIcon, getButtonByLabel } from '@/test-utils/uiTestHelpers';
import TagsListActions from './TagsListActions.component';
import { IamTagListItem, TagType } from '@/data/api/get-iam-tags';
import { urls } from '@/routes/routes.constant';

/** RENDER */
const renderComponent = (item: IamTagListItem) => {
  return render(<TagsListActions {...item} />);
};

describe('TagListActionsCell Component', async () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(ReactRouterDom, 'useNavigate').mockImplementation(
      () => mockNavigate,
    );
  });

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

    expect(mockNavigate).toHaveBeenCalledWith(
      urls.tagDetailAssign.replace(':tag', 'env:prod'),
    );
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

    expect(mockNavigate).toHaveBeenCalledWith(
      urls.tagDetail.replace(':tag', 'env:prod'),
    );
  });
});
