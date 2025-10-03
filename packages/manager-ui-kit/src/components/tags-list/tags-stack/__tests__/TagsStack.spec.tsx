import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TagsStack } from '../TagsStack.component';
import * as TagsStackUtils from '../TagsStack.utils';

vi.mock('../TagsStack.utils', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getVisibleTagCount: vi.fn(),
  };
});

const mockTags = ['tag1:tag1', 'tag2:tag2', 'tag3:tage3', 'tag4:tag4'];

describe('TagsStack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing if tags are empty', () => {
    const { container, rerender } = render(<TagsStack tags={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all tags when maxLines is not provided', () => {
    render(<TagsStack tags={mockTags} />);

    mockTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('calls getVisibleTagCount when maxLines is provided', () => {
    vi.mocked(TagsStackUtils.getVisibleTagCount).mockReturnValue(2);

    render(<TagsStack tags={mockTags} maxLines={2} />);

    expect(screen.getByText(/tag1/i)).toBeInTheDocument();
    expect(screen.getByText(/tag2/i)).toBeInTheDocument();
    expect(screen.getByText(/tag3/i)).toBeInTheDocument();
    expect(screen.queryByText(/tag4/i)).not.toBeInTheDocument();

    // Should show "more" icon
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('does not show more icon if all tags are visible', () => {
    vi.mocked(TagsStackUtils.getVisibleTagCount).mockReturnValue(3);
    render(<TagsStack tags={mockTags} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('calls onClick when more icon is clicked', () => {
    vi.mocked(TagsStackUtils.getVisibleTagCount).mockReturnValue(1);

    const handleClick = vi.fn();
    render(<TagsStack tags={mockTags} maxLines={1} onClick={handleClick} />);

    const link = screen.getByRole('link');
    link.click();

    expect(handleClick).toHaveBeenCalled();
  });
});
