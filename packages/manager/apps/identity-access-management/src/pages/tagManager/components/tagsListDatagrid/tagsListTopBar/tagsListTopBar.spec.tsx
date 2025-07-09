import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getButtonByLabel } from '@/test-utils/uiTestHelpers';
import TagsListTopbar from './tagsListTopbar.component';
import { TagManagerContext } from '@/pages/tagManager/tagsManagerContext';

const queryClient = new QueryClient();

/** RENDER */
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <TagManagerContext.Provider
        value={{
          toggleSystemCheck: vi.fn(),
          isShowSystemChecked: false,
          toggleUnassignedResources: vi.fn(),
          isShowUnassignedResourcesChecked: false,
        }}
      >
        <TagsListTopbar />
      </TagManagerContext.Provider>
    </QueryClientProvider>,
  );
};

describe('TagListTopBar Component', async () => {
  it('Should display assign button', async () => {
    const { container } = renderComponent();
    const assignButton = await getButtonByLabel({
      container,
      label: 'assignTags',
    });

    fireEvent.click(assignButton);

    // Todo: Finish this test when assign action is done
  });
});
