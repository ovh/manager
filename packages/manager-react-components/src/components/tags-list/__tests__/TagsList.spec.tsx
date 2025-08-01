import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from '@testing-library/react';
import { TagsList } from '../TagsList.component';
import * as TagsStackUtils from '../tags-stack/TagsStack.utils';

vi.mock('../tags-stack/TagsStack.utils', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getVisibleTagCount: vi.fn(),
  };
});

describe('TagsList Component', () => {
  const mockTags = {
    tag1: 'tag1',
    tag2: 'tag2',
    tag3: 'tag3',
    tag4: 'tag4',
    'ovh:tag1': 'ovh:tag1',
    'ovh:tag2': 'ovh:tag2',
    'ovh:tag3': 'ovh:tag3',
  };
  const modalHeader = 'Test Resource';
  const onEditTags = vi.fn();

  it('renders all tags in TagsList without modal', () => {
    vi.mocked(TagsStackUtils.getVisibleTagCount).mockReturnValue(6);
    render(
      <TagsList
        tags={mockTags}
        modalHeading={modalHeader}
        onEditTags={onEditTags}
        displayInternalTags={true}
      />,
    );
    Object.entries(mockTags).forEach(([key, value]) => {
      expect(screen.getByText(`${key}:${value}`)).toBeInTheDocument();
    });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders Tags with modal (opens and close tags modal)', async () => {
    vi.mocked(TagsStackUtils.getVisibleTagCount).mockReturnValue(2);
    const { baseElement } = render(
      <TagsList
        tags={mockTags}
        modalHeading={modalHeader}
        onEditTags={onEditTags}
        displayInternalTags={true}
        maxLines={1}
      />,
    );
    const moreTagsButton = screen.getByRole('link');
    fireEvent.click(moreTagsButton);
    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(modalHeader, 'gi')),
      ).toBeInTheDocument();
      const closeButton = within(baseElement).getByTestId('secondary-button');
      fireEvent.click(closeButton);
      expect(
        screen.queryByText(new RegExp(modalHeader, 'gi')),
      ).not.toBeInTheDocument();
    });
  });

  it('renders Tags Modal and calls onEditTags callback', async () => {
    vi.mocked(TagsStackUtils.getVisibleTagCount).mockReturnValue(2);
    render(
      <TagsList
        tags={mockTags}
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
