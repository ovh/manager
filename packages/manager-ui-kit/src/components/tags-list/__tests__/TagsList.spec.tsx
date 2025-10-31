import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MockedFunction, describe, expect, it, vi } from 'vitest';

import { tags } from '@/commons/tests-utils/StaticData.constants';
import { TagsList } from '@/components/tags-list/TagsList.component';

import * as TagsStackUtils from '../tags-stack/TagsStack.utils';

vi.mock('../tags-stack/TagsStack.utils', async (importOriginal) => {
  const actual = await importOriginal();
  const mockedModule: typeof import('../tags-stack/TagsStack.utils') = {
    ...(actual as object),
    getVisibleTagCount: vi.fn(),
  };
  return mockedModule;
});

const mockGetVisibleTagCount = TagsStackUtils.getVisibleTagCount as MockedFunction<
  typeof TagsStackUtils.getVisibleTagCount
>;

describe('TagsList Component', () => {
  const modalHeader = 'Test Resource';
  const onEditTags = vi.fn();

  it('renders all tags in TagsList without modal', () => {
    mockGetVisibleTagCount.mockReturnValue(6);

    render(
      <TagsList
        tags={tags}
        modalHeading={modalHeader}
        onEditTags={onEditTags}
        displayInternalTags={true}
      />,
    );

    Object.entries(tags).forEach(([key, value]) => {
      expect(screen.getByText(`${key}:${value}`)).toBeInTheDocument();
    });

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders Tags with modal (opens and closes tags modal)', async () => {
    mockGetVisibleTagCount.mockReturnValue(2);

    const { baseElement } = render(
      <TagsList
        tags={tags}
        modalHeading={modalHeader}
        onEditTags={onEditTags}
        displayInternalTags={true}
        maxLines={1}
      />,
    );

    const moreTagsButton = screen.getByRole('link');
    fireEvent.click(moreTagsButton);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(modalHeader, 'gi'))).toBeInTheDocument();
      const closeButton = within(baseElement).getByTestId('secondary-button');
      fireEvent.click(closeButton);
      expect(screen.queryByText(new RegExp(modalHeader, 'gi'))).not.toBeInTheDocument();
    });
  });

  it('renders Tags Modal and calls onEditTags callback', async () => {
    mockGetVisibleTagCount.mockReturnValue(2);

    render(
      <TagsList
        tags={tags}
        modalHeading={modalHeader}
        onEditTags={onEditTags}
        displayInternalTags={true}
        maxLines={1}
      />,
    );

    const moreTagsButton = screen.getByRole('link');
    fireEvent.click(moreTagsButton);

    await waitFor(() => {
      const editTagsButton = screen.getByTestId('primary-button');
      fireEvent.click(editTagsButton);
      expect(onEditTags).toHaveBeenCalled();
    });
  });
});
