import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TagsList } from '../TagsList.component';
import * as utils from '../TagsList.utils';

vi.mock('../TagsList.utils', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getVisibleTagCount: vi.fn(),
  };
});

const mockTags = {
  tag1: 'tag1',
  tag2: 'tag2',
  tag3: 'tag3',
  tag4: 'tag4',
  'ovh:tag1': 'ovh:tag1',
  'ovh:tag2': 'ovh:tag2',
  'ovh:tag3': 'ovh:tag3',
};

describe('TagsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing if tags are empty', () => {
    const { container, rerender } = render(<TagsList tags={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all tags when maxLines is not provided', () => {
    render(<TagsList tags={mockTags} />);

    Object.entries(mockTags).forEach(([key, value]) => {
      if (!key.includes('ovh:'))
        expect(screen.getByText(`${key}:${value}`)).toBeInTheDocument();
    });
  });

  it('calls getVisibleTagCount when maxLines is provided', () => {
    vi.mocked(utils.getVisibleTagCount).mockReturnValue(2);

    render(<TagsList tags={mockTags} maxLines={2} />);

    expect(screen.getByText(/tag1/i)).toBeInTheDocument();
    expect(screen.getByText(/tag2/i)).toBeInTheDocument();
    expect(screen.getByText(/tag3/i)).toBeInTheDocument();
    expect(screen.queryByText(/tag4/i)).not.toBeInTheDocument();

    // Should show "more" icon
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('does not show more icon if all tags are visible', () => {
    vi.mocked(utils.getVisibleTagCount).mockReturnValue(3);
    render(<TagsList tags={mockTags} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('calls onClick when more icon is clicked', () => {
    vi.mocked(utils.getVisibleTagCount).mockReturnValue(1);

    const handleClick = vi.fn();
    render(<TagsList tags={mockTags} maxLines={1} onClick={handleClick} />);

    const link = screen.getByRole('link');
    link.click();

    expect(handleClick).toHaveBeenCalled();
  });
});
