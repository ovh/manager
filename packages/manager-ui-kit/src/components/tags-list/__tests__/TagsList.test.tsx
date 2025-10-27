import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tags } from '@/commons/tests-utils/StaticData.constants';
import { TagsList } from '@/components/tags-list/TagsList.component';

import * as tagsStackUtils from '../tags-stack/TagsStack.utils';

vi.mock('../tags-stack/TagsStack.utils', async (importOriginal) => {
  const actual = await importOriginal();
  const mockedModule: typeof import('../tags-stack/TagsStack.utils') = {
    ...(actual as object),
    getVisibleTagCount: vi.fn(),
  };
  return mockedModule;
});

describe('TagsList Component - Snapshot Tests', () => {
  const modalHeader = 'Test Resource';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays all tags', () => {
    vi.mocked(tagsStackUtils.getVisibleTagCount).mockReturnValue(8);

    const { container } = render(<TagsList tags={tags} modalHeading={modalHeader} />);

    expect(container).toMatchSnapshot();
  });

  it('displays fewer tags along with Link', () => {
    vi.mocked(tagsStackUtils.getVisibleTagCount).mockReturnValue(2);

    const { container } = render(<TagsList tags={tags} maxLines={2} modalHeading={modalHeader} />);

    expect(container).toMatchSnapshot();
  });

  it('displays modal on click of "More tags" link', async () => {
    vi.mocked(tagsStackUtils.getVisibleTagCount).mockReturnValue(1);

    const { baseElement } = render(
      <TagsList tags={tags} maxLines={1} modalHeading={modalHeader} />,
    );
    const moreTagsLink = screen.getByRole('link');
    fireEvent.click(moreTagsLink);
    await waitFor(() => {
      expect(baseElement).toMatchSnapshot();
    });
  });
});
