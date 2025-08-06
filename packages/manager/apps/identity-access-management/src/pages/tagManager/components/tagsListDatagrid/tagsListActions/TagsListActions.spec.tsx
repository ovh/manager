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
import {
  TagManagerContextType,
  useTagManagerContext,
} from '@/pages/tagManager/TagManagerContext';
import tagsList from '../../../../../mocks/iam-tags/getIamTags.json';

/** MOCKS  */
vi.mock('@/pages/tagManager/TagManagerContext', async (importOriginal) => ({
  ...(await importOriginal()),
  useTagManagerContext: vi.fn(),
}));

/** RENDER */
const renderComponent = ({
  name,
  type,
  count,
  selectedTagsList,
}: IamTagListItem & Partial<TagManagerContextType>) => {
  vi.mocked(useTagManagerContext).mockReturnValue({
    selectedTagsList: selectedTagsList || [],
    setSelectedTagsList: vi.fn(),
    isShowSystemChecked: false,
    isShowUnassignedResourcesChecked: false,
    toggleSystemCheck: vi.fn(),
    toggleUnassignedResources: vi.fn(),
  });
  return render(<TagsListActions name={name} type={type} count={count} />);
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

  it('Should disable menu action when multiple tags are selected', async () => {
    const { container } = renderComponent({
      name: 'env:prod',
      count: 1,
      type: TagType.CUSTOM_TAG,
      selectedTagsList: tagsList.list as IamTagListItem[],
    });

    const menuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });

    fireEvent.click(menuButton);

    await getButtonByLabel({
      container,
      label: 'manageResources',
      disabled: true,
    });
  });

  it('Should enable menu action if the current tag is selected', async () => {
    const { container } = renderComponent({
      name: 'Environment:Production',
      count: 1,
      type: TagType.CUSTOM_TAG,
      selectedTagsList: [tagsList.list[0]] as IamTagListItem[],
    });

    const menuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });

    fireEvent.click(menuButton);

    await getButtonByLabel({
      container,
      label: 'manageResources',
    });
  });
});
