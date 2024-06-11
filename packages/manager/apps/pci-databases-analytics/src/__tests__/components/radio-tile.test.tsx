import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import RadioTile from '@/components/radio-tile';

describe('RadioTile component', () => {
  it('should display the radio tile', async () => {
    render(
      <RadioTile>
        <h4>title</h4>
        <RadioTile.Separator />
        <p>content</p>
      </RadioTile>,
    );
    await waitFor(() => {
      expect(screen.getByText('title')).toBeInTheDocument();
      expect(screen.getByText('content')).toBeInTheDocument();
    });
  });

  it('should trigger callback when selected', async () => {
    const onChange = vi.fn();
    render(
      <RadioTile onChange={onChange} checked={false}>
        <h4>title</h4>
        <RadioTile.Separator />
        <p>content</p>
      </RadioTile>,
    );
    act(() => {
      fireEvent.click(screen.getByTestId('radio-tile-input'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('should select on key down', async () => {
    const onChange = vi.fn();
    render(
      <RadioTile onChange={onChange} checked={false}>
        <h4>title</h4>
        <RadioTile.Separator />
        <p>content</p>
      </RadioTile>,
    );
    act(() => {
      fireEvent.keyDown(screen.getByTestId('radio-tile-container'), {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('should have a different style when selected', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <RadioTile onChange={onChange} checked={false}>
        foo
      </RadioTile>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('radio-tile-label')).not.toHaveClass(
        'selected',
      );
    });
    act(() => {
      rerender(
        <RadioTile onChange={onChange} checked={true}>
          foo
        </RadioTile>,
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('radio-tile-label')).toHaveClass('selected');
    });
  });
});
