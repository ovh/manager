import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { vi } from 'vitest';
import TagsInput from '@/components/tags-input/TagsInput.component';

describe('TagsInput component', () => {
  it('should render correctly with initial tags', () => {
    const handleChange = vi.fn();
    render(
      <TagsInput
        value={['tag1', 'tag2']}
        onChange={handleChange}
        placeholder="Enter tag"
      />,
    );

    const inputElement = screen.getByPlaceholderText('Enter tag');
    expect(inputElement).toBeInTheDocument();

    const tag1Element = screen.getByText('tag1');
    expect(tag1Element).toBeInTheDocument();

    const tag2Element = screen.getByText('tag2');
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

  it('should add new tag when user presses button', async () => {
    // initial state
    let tags: string[] = ['tag1', 'tag2'];
    // dom
    const dom = (onChange: (newTags: string[]) => void) => (
      <TagsInput
        min={1}
        max={10}
        pattern={/^[a-zA-Z0-9]+$/}
        value={tags}
        onChange={onChange}
        placeholder="Enter tag"
      />
    );
    // spy, rerender component on call
    const mockOnChange = vi.fn((newTags: string[]) => {
      tags = [...newTags];
    });
    // initialize renderer
    const component = render(
      dom((newTags) => {
        mockOnChange(newTags);
        component.rerender(dom(() => {}));
      }),
    );

    // act
    const inputElement = screen.getByTestId('input_tag');
    const addTagButton = screen.getByTestId('add_tag_button');
    act(() => {
      fireEvent.input(inputElement, {
        target: {
          value: 'tag3',
        },
      });
      fireEvent.click(addTagButton);
    });
    // assert
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
      expect(screen.getByText('tag3')).toBeInTheDocument();
      expect(inputElement).toHaveValue('');
    });
  });

  it('should add new tag when user presses enter', async () => {
    // initial state
    let tags: string[] = ['tag1', 'tag2'];
    // dom
    const dom = (onChange: (newTags: string[]) => void) => (
      <TagsInput
        min={1}
        max={10}
        pattern={/^[a-zA-Z0-9]+$/}
        value={tags}
        onChange={onChange}
        placeholder="Enter tag"
      />
    );
    // spy, rerender component on call
    const mockOnChange = vi.fn((newTags: string[]) => {
      tags = [...newTags];
    });
    // initialize renderer
    const component = render(
      dom((newTags) => {
        mockOnChange(newTags);
        component.rerender(dom(() => {}));
      }),
    );
    // act
    const inputElement = screen.getByTestId('input_tag');
    act(() => {
      fireEvent.input(inputElement, {
        target: {
          value: 'tag3',
        },
      });
      fireEvent.keyDown(inputElement, { key: 'Enter', code: 13, charCode: 13 });
    });
    // assert
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
      expect(screen.getByText('tag3')).toBeInTheDocument();
      expect(inputElement).toHaveValue('');
    });
  });

  it('should display an error when tag is too short', async () => {
    // initial state
    const tags: string[] = ['tag1'];
    // dom
    const dom = (onChange: (newTags: string[]) => void) => (
      <TagsInput
        min={5}
        max={10}
        pattern={/^[a-zA-Z0-9]+$/}
        value={tags}
        onChange={onChange}
        placeholder="Enter tag"
      />
    );
    // spy, rerender component on call
    const mockOnChange = vi.fn();
    // initialize renderer
    render(dom(mockOnChange));
    // act
    const inputElement = screen.getByTestId('input_tag');
    const addTagButton = screen.getByTestId('add_tag_button');
    act(() => {
      fireEvent.input(inputElement, {
        target: {
          value: 'tag2',
        },
      });
      fireEvent.click(addTagButton);
    });
    // assert
    await waitFor(() => {
      expect(mockOnChange).not.toHaveBeenCalled();
      expect(
        screen.getByText('String must contain at least 5 character(s)'),
      ).toBeInTheDocument();
      expect(inputElement).toHaveValue('tag2');
    });
  });

  it('should display an error when tag is too long', async () => {
    // initial state
    const tags: string[] = ['tag1'];
    // dom
    const dom = (onChange: (newTags: string[]) => void) => (
      <TagsInput
        min={1}
        max={10}
        pattern={/^[a-zA-Z0-9]+$/}
        value={tags}
        onChange={onChange}
        placeholder="Enter tag"
      />
    );
    // spy, rerender component on call
    const mockOnChange = vi.fn();
    // initialize renderer
    render(dom(mockOnChange));
    // act
    const inputElement = screen.getByTestId('input_tag');
    const addTagButton = screen.getByTestId('add_tag_button');
    act(() => {
      fireEvent.input(inputElement, {
        target: {
          value: 'tagwithaverylongvaluethatexceedsmaximum',
        },
      });
      fireEvent.click(addTagButton);
    });
    // assert
    await waitFor(() => {
      expect(mockOnChange).not.toHaveBeenCalled();
      expect(
        screen.getByText('String must contain at most 10 character(s)'),
      ).toBeInTheDocument();
      expect(inputElement).toHaveValue(
        'tagwithaverylongvaluethatexceedsmaximum',
      );
    });
  });

  it('should display an error when tag does not match pattern', async () => {
    // initial state
    const tags: string[] = ['tag1'];
    // dom
    const dom = (onChange: (newTags: string[]) => void) => (
      <TagsInput
        min={1}
        max={20}
        pattern={/^[a-zA-Z0-9]+$/}
        value={tags}
        onChange={onChange}
        placeholder="Enter tag"
      />
    );
    // spy, rerender component on call
    const mockOnChange = vi.fn();
    // initialize renderer
    render(dom(mockOnChange));
    // act
    const inputElement = screen.getByTestId('input_tag');
    const addTagButton = screen.getByTestId('add_tag_button');
    act(() => {
      fireEvent.input(inputElement, {
        target: {
          value: 'tag@forbidden',
        },
      });
      fireEvent.click(addTagButton);
    });
    // assert
    await waitFor(() => {
      expect(mockOnChange).not.toHaveBeenCalled();
      expect(screen.getByText('Invalid pattern')).toBeInTheDocument();
      expect(inputElement).toHaveValue('tag@forbidden');
    });
  });

  it('should display an error when adding a duplicate tag', async () => {
    // initial state
    const tags: string[] = ['tag1'];
    // dom
    const dom = (onChange: (newTags: string[]) => void) => (
      <TagsInput
        min={1}
        max={20}
        pattern={/^[a-zA-Z0-9]+$/}
        value={tags}
        onChange={onChange}
        placeholder="Enter tag"
      />
    );
    // spy, rerender component on call
    const mockOnChange = vi.fn();
    // initialize renderer
    render(dom(mockOnChange));
    // act
    const inputElement = screen.getByTestId('input_tag');
    const addTagButton = screen.getByTestId('add_tag_button');
    act(() => {
      fireEvent.input(inputElement, {
        target: {
          value: 'tag1',
        },
      });
      fireEvent.click(addTagButton);
    });
    // assert
    await waitFor(() => {
      expect(mockOnChange).not.toHaveBeenCalled();
      expect(screen.getByText('No duplicate value')).toBeInTheDocument();
      expect(inputElement).toHaveValue('tag1');
    });
  });
});
