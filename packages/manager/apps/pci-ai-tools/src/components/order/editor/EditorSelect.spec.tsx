import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import EditorsSelect from './EditorSelect.component';
import {
  mockedEditor,
  mockedEditorBis,
} from '@/__tests__/helpers/mocks/capabilities/notebookEditor';

describe('Editor Select component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display the Editor Select radio tile', async () => {
    render(
      <EditorsSelect
        editors={[mockedEditor, mockedEditorBis]}
        value={mockedEditor.name}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('editors-select-container'),
      ).toBeInTheDocument();
    });
  });
  it('should trigger callback when selected', async () => {
    render(
      <EditorsSelect
        editors={[mockedEditor, mockedEditorBis]}
        value={mockedEditor.id}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('editors-select-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`editor-radio-tile-${mockedEditor.id}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`editor-radio-tile-${mockedEditorBis.id}`),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(
        screen.getByTestId(`editor-radio-tile-${mockedEditorBis.id}`),
      );
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(mockedEditorBis.id);
    });
  });
});
