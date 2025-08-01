import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TagsList } from '../TagsList.component';
import * as tagsStackUtils from '../tags-stack/TagsStack.utils';

vi.mock('../tags-stack/TagsStack.utils', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getVisibleTagCount: vi.fn(),
  };
});

// Since JSDOM does not provide complete support for Layout APIs like offsetWidth
// (ref: https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform)
// Few scenarios like displaying the ellipsis, actual number of tags that are displayed in the available space
// are not tested.

// TODO: Add Visual regression tests for the missing test scenarios

describe('TagsList Component - Snapshot Tests', () => {
  const mockTags = {
    key1: 'Lorem ipsum dolor',
    key2: 'Lorem ipsum consectetur sit amet consectetur',
    key3: 'Lorem ipsum',
    key4: 'Lorem ipsum dolor',
    key5: 'Lorem ipsum dolor sit consectetur',
    key6: 'Lorem ipsumsit amet consectetur adipiscing elit quisque',
    key7: 'Lorem ipsum',
    key8: 'Lorem ipsum',
    key9: 'Lorem ipsum',
    'ovh:key1': 'Lorem ipsum',
    'ovh:key2': 'Lorem ipsum dolor',
  };

  const modalHeader = 'Test Resource';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays all tags', () => {
    vi.mocked(tagsStackUtils.getVisibleTagCount).mockReturnValue(8);

    const { container } = render(
      <TagsList tags={mockTags} modalHeading={modalHeader} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('displays fewer tags along with Link', () => {
    vi.mocked(tagsStackUtils.getVisibleTagCount).mockReturnValue(2);

    const { container } = render(
      <TagsList tags={mockTags} maxLines={2} modalHeading={modalHeader} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('displays modal on click of "More tags" link', async () => {
    vi.mocked(tagsStackUtils.getVisibleTagCount).mockReturnValue(1);

    const { baseElement } = render(
      <TagsList tags={mockTags} maxLines={1} modalHeading={modalHeader} />,
    );
    const moreTagsLink = screen.getByRole('link');
    fireEvent.click(moreTagsLink);
    await waitFor(() => {
      expect(baseElement).toMatchSnapshot();
    });
  });
});
