import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import TagsInput from '../../components/tags-input';

describe('TagsInput component', () => {
  const mockOnChange = vi.fn((tag) => {
    return Promise.resolve({ tag });
  });

  it('should render correctly with initial tags', () => {
    const handleChange = vi.fn();
    const { getByPlaceholderText, getByText } = render(
      <TagsInput
        value={['tag1', 'tag2']}
        onChange={handleChange}
        placeholder="Enter tag"
      />,
    );

    const inputElement = getByPlaceholderText('Enter tag');
    expect(inputElement).toBeInTheDocument();

    const tag1Element = getByText('tag1');
    expect(tag1Element).toBeInTheDocument();

    const tag2Element = getByText('tag2');
    expect(tag2Element).toBeInTheDocument();
  });

  it('should remove tag when remove button is clicked', () => {
    const handleChange = vi.fn();
    render(
      <TagsInput
        value={['tag1', 'tag2']}
        onChange={handleChange}
        placeholder="Enter tag"
      />,
    );
    const removeButton = screen.getByTestId('remove_tag_button_0');
    fireEvent.click(removeButton);
    expect(handleChange).toHaveBeenCalledWith(['tag2']);
  });

  it('should add new tag when user presses Enter', () => {
    // const handleChange = vi.fn();
    render(
      <TagsInput
        min={1}
        max={10}
        pattern={/^[a-zA-Z0-9]+$/}
        value={['tag1', 'tag2']}
        onChange={mockOnChange}
        placeholder="Enter tag"
      />,
    );

    const inputElement = screen.getByTestId('input_tag');
    const addTagButton = screen.getByTestId('add_tag_button');

    fireEvent.input(inputElement, {
      target: {
        value: 'tag3',
      },
    });

    fireEvent.click(addTagButton);

    // screen.debug();
    expect(mockOnChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
  });
});
