import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import * as ReactRouterDom from 'react-router-dom';
import { getButtonByIcon, getButtonByLabel } from '@/test-utils/uiTestHelpers';
import { urls } from '@/routes/routes.constant';
import TagDetailActions, {
  TagDetailActionsProps,
} from './TagDetailActions.component';
import { iamResourcesListMock } from '@/mocks/iam-resource/iam-resource.mock';
import {
  ResourcesDatagridContextType,
  useResourcesDatagridContext,
} from '@/components/resourcesDatagrid/ResourcesDatagridContext';

/** MOCKS  */
vi.mock(
  '@/components/resourcesDatagrid/ResourcesDatagridContext',
  async (importOriginal) => ({
    ...(await importOriginal()),
    useResourcesDatagridContext: vi.fn(),
  }),
);

/** RENDER */
const renderComponent = ({
  item,
  tag,
  selectedResourcesList,
}: TagDetailActionsProps & Partial<ResourcesDatagridContextType>) => {
  vi.mocked(useResourcesDatagridContext).mockReturnValue({
    selectedResourcesList: selectedResourcesList || [],
    setSelectedResourcesList: vi.fn(),
    filters: [],
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
    setFilters: vi.fn(),
  });
  return render(<TagDetailActions item={item} tag={tag} />);
};

describe('TagDetailActions Component', async () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(ReactRouterDom, 'useNavigate').mockImplementation(
      () => mockNavigate,
    );
  });

  it('Should display action menu with unassign button', async () => {
    const { container } = renderComponent({
      item: iamResourcesListMock[0],
      tag: 'tag:test',
    });

    const menuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });

    fireEvent.click(menuButton);

    const unassignButton = await getButtonByLabel({
      container,
      label: 'unassignAction',
    });

    fireEvent.click(unassignButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      urls.tagdetailUnassign.replace(':tag', 'tag:test'),
      {
        state: {
          resources: [
            {
              displayName: 'r1',
              id: '1',
              name: 'r1',
              owner: 'mock',
              type: 'dedicatedServer',
              urn: 'urn-r1',
            },
          ],
        },
      },
    );
  });

  it('Should disable menu action when multiple tags are selected', async () => {
    const { container } = renderComponent({
      item: iamResourcesListMock[0],
      tag: 'tag:test',
      selectedResourcesList: iamResourcesListMock,
    });

    const menuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });

    fireEvent.click(menuButton);

    await getButtonByLabel({
      container,
      label: 'unassignAction',
      disabled: true,
    });
  });

  it('Should enable menu action if the current tag is selected', async () => {
    const { container } = renderComponent({
      item: iamResourcesListMock[0],
      tag: 'tag:test',
      selectedResourcesList: [iamResourcesListMock[0]],
    });

    const menuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });

    fireEvent.click(menuButton);

    await getButtonByLabel({
      container,
      label: 'unassignAction',
    });
  });
});
