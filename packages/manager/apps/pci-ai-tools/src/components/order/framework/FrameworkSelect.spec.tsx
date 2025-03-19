import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import FrameworksSelect from './FrameworkSelect.component';
import {
  mockedFramework,
  mockedFrameworkBis,
} from '@/__tests__/helpers/mocks/capabilities/notebookFramework';

describe('Framework Select component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Framework Select', async () => {
    render(
      <FrameworksSelect
        frameworks={[mockedFramework, mockedFrameworkBis]}
        value={{
          framework: mockedFramework.id,
          version: mockedFramework.versions[0],
        }}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('fmk-select-container')).toBeInTheDocument();
      expect(
        screen.getByTestId(`fmk-radio-tile-${mockedFramework.id}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`fmk-radio-tile-${mockedFrameworkBis.id}`),
      ).toBeInTheDocument();
    });
  });

  it('should trigger callback when selected', async () => {
    render(
      <FrameworksSelect
        frameworks={[mockedFramework, mockedFrameworkBis]}
        value={{
          framework: mockedFramework.id,
          version: mockedFramework.versions[0],
        }}
        onChange={onChange}
      />,
    );
    const fmkRadioTileId = `fmk-radio-tile-${mockedFrameworkBis.id}`;
    await waitFor(() => {
      expect(screen.getByTestId(fmkRadioTileId)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId(fmkRadioTileId));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        framework: mockedFrameworkBis.id,
        version: mockedFrameworkBis.versions[0],
      });
    });
  });
});
