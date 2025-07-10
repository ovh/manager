import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { getButtonByLabel } from '@/test-utils/uiTestHelpers';
import TagsListFilter from './TagsListFilter.component';
import {
  useTagManagerContext,
  TagManagerContextProvider,
  TagManagerContextType,
} from '@/pages/tagManager/TagManagerContext';

/** MOCKS  */
vi.mock('@/pages/tagManager/TagManagerContext', async (importOriginal) => ({
  ...(await importOriginal()),
  useTagManagerContext: vi.fn(),
}));

const renderComponent = ({
  isShowSystemChecked,
  isShowUnassignedResourcesChecked,
  selectedTagsList,
  setSelectedTagsList,
  toggleSystemCheck,
  toggleUnassignedResources,
}: Partial<TagManagerContextType>) => {
  vi.mocked(useTagManagerContext).mockReturnValue({
    selectedTagsList: selectedTagsList || [],
    setSelectedTagsList: setSelectedTagsList || vi.fn(),
    isShowSystemChecked: !!isShowSystemChecked,
    isShowUnassignedResourcesChecked: !!isShowUnassignedResourcesChecked,
    toggleSystemCheck: toggleSystemCheck || vi.fn(),
    toggleUnassignedResources: toggleUnassignedResources || vi.fn(),
  });

  return render(
    <TagManagerContextProvider>
      <TagsListFilter />
    </TagManagerContextProvider>,
  );
};

describe('TagsListFilter Component', async () => {
  it('Should display filter menu with system checkbox', async () => {
    const toggleSystemCheckMock = vi.fn();
    const { container, getByText } = renderComponent({
      toggleSystemCheck: toggleSystemCheckMock,
    });

    const filterButton = await getButtonByLabel({
      container,
      label: 'quickFilters',
    });

    fireEvent.click(filterButton);

    const systemCheckbox = getByText('showSystemTag');
    fireEvent.click(systemCheckbox);

    expect(toggleSystemCheckMock).toHaveBeenCalled();
  });

  it('Should display filter menu with unassigned checkbox', async () => {
    const toggleUnassignedResourcesMock = vi.fn();
    const { container, getByText } = renderComponent({
      toggleUnassignedResources: toggleUnassignedResourcesMock,
    });

    const filterButton = await getButtonByLabel({
      container,
      label: 'quickFilters',
    });

    fireEvent.click(filterButton);

    const unassignedCheckbox = getByText('showUnassignedTag');
    fireEvent.click(unassignedCheckbox);

    expect(toggleUnassignedResourcesMock).toHaveBeenCalled();
  });
});
