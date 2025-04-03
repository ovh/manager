import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import FrameworkTile from './FrameworkTile.component';
import { mockedFrameworkBis } from '@/__tests__/helpers/mocks/capabilities/notebookFramework';

describe('Framework Tile component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display FrameworkTile with Version Selector', async () => {
    render(
      <FrameworkTile
        framework={mockedFrameworkBis}
        version={mockedFrameworkBis.versions[0]}
        selected={false}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId(`fmk-radio-tile-${mockedFrameworkBis.id}`),
      ).toBeTruthy();
      expect(screen.getByTestId('fmk-tile-version-container')).toBeTruthy();
    });
  });

  it('should trigger callback when selected', async () => {
    render(
      <FrameworkTile
        framework={mockedFrameworkBis}
        version={mockedFrameworkBis.versions[0]}
        selected={false}
        onChange={onChange}
      />,
    );
    const fmkRadioTileId = `fmk-radio-tile-${mockedFrameworkBis.id}`;
    await waitFor(() => {
      expect(screen.getByTestId(fmkRadioTileId)).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId(fmkRadioTileId));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
