import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { TagsList } from '../TagsList.component';
import * as utils from '../TagsList.utils';

vi.mock('../TagsList.utils', async (importOriginal) => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays all tags', () => {
    vi.mocked(utils.getVisibleTagCount).mockReturnValue(8);

    const { container } = render(<TagsList tags={mockTags} />);

    expect(container).toMatchSnapshot();
  });

  it('displays fewer tags along with Link', () => {
    vi.mocked(utils.getVisibleTagCount).mockReturnValue(2);

    const { container } = render(<TagsList tags={mockTags} maxLines={2} />);

    expect(container).toMatchSnapshot();
  });
});
