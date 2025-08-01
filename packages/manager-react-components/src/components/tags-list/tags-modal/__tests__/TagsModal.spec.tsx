import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { TagsModal } from '../TagsModal.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TagsModal', () => {
  const mockTags = ['tag1:tag1', 'tag2:tag2', 'tag3:tage3', 'tag4:tag4'];
  const heading = 'Test Resource';
  const onCancel = vi.fn();
  const onEditTags = vi.fn();

  it('renders the Tags Modal', () => {
    render(
      <TagsModal
        open={true}
        heading={heading}
        tags={mockTags}
        onCancel={onCancel}
        onEditTags={onEditTags}
      />,
    );

    expect(screen.queryByText(new RegExp(heading, 'gi'))).toBeInTheDocument();
    expect(screen.queryByText('back').tagName).toBe('BUTTON');
    expect(screen.queryByText('edit_tags').tagName).toBe('BUTTON');
  });

  it('renders the Tags Modal without "Edit Tags" button', () => {
    render(
      <TagsModal
        open={true}
        heading={heading}
        tags={mockTags}
        onCancel={onCancel}
      />,
    );

    expect(screen.queryByText('edit_tags')).not.toBeInTheDocument();
  });

  it('calls "onClose" callback when close button is clicked', () => {
    render(
      <TagsModal
        open={true}
        heading={heading}
        tags={mockTags}
        onCancel={onCancel}
      />,
    );
    const closeButton = screen.getByText('back');
    fireEvent.click(closeButton);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls "onEditTags" callback when Edit Tags button is clicked', () => {
    render(
      <TagsModal
        open={true}
        heading={heading}
        tags={mockTags}
        onCancel={onCancel}
        onEditTags={onEditTags}
      />,
    );
    const editTagsButton = screen.getByText('edit_tags');
    fireEvent.click(editTagsButton);
    expect(onEditTags).toHaveBeenCalledOnce();
  });

  it('filters tags correctly when searching', async () => {
    render(
      <TagsModal
        open={true}
        heading="My Tags"
        tags={mockTags}
        onCancel={() => {}}
        onEditTags={() => {}}
      />,
    );

    const input = screen.getByPlaceholderText('search_placeholder');
    fireEvent.change(input, { target: { value: 'tag1' } });

    const searchButton = screen.getByText('search');
    fireEvent.click(searchButton);
    expect(screen.getAllByText(/tag1/i).length).toBe(1);
    expect(screen.queryAllByText(/tag2/i).length).toBe(0);

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(searchButton);
    expect(screen.queryAllByText(/tag2/i).length).toBe(1);
  });
});
