import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { getButtonByLabel } from '@/test-utils/uiTestHelpers';
import TagsListFilter from './tagsListFilter.component';
import { TagManagerContext } from '@/pages/tagManager/tagsManagerContext';

/** MOCKS  */
let isShowSystemChecked = false;
const toggleSystemCheckMock = vi.fn().mockImplementation(() => {
  isShowSystemChecked = !isShowSystemChecked;
});
let isShowUnassignedResourcesChecked = false;
const toggleUnassignedResources = vi.fn().mockImplementation(() => {
  isShowUnassignedResourcesChecked = !isShowUnassignedResourcesChecked;
});

/** RENDER */
const renderComponent = () => {
  return render(
    <TagManagerContext.Provider
      value={{
        toggleSystemCheck: toggleSystemCheckMock,
        isShowSystemChecked,
        toggleUnassignedResources,
        isShowUnassignedResourcesChecked,
      }}
    >
      <TagsListFilter />
    </TagManagerContext.Provider>,
  );
};

describe('TagsListFilter Component', async () => {
  it('Should display filter menu with system checkbox', async () => {
    const { container, getByText } = renderComponent();
    const filterButton = await getButtonByLabel({
      container,
      label: 'quickFilters',
    });

    await waitFor(() => fireEvent.click(filterButton));

    const systemCheckbox = getByText('showSystemTag');
    await waitFor(() => fireEvent.click(systemCheckbox));

    expect(toggleSystemCheckMock).toHaveBeenCalled();
    expect(isShowSystemChecked).toBe(true);
  });

  it('Should display filter menu with unassigned checkbox', async () => {
    const { container, getByText } = renderComponent();
    const filterButton = await getButtonByLabel({
      container,
      label: 'quickFilters',
    });

    await waitFor(() => fireEvent.click(filterButton));

    const unassignedCheckbox = getByText('showUnassignedTag');
    await waitFor(() => fireEvent.click(unassignedCheckbox));

    expect(toggleUnassignedResources).toHaveBeenCalled();
    expect(isShowUnassignedResourcesChecked).toBe(true);
  });
});
