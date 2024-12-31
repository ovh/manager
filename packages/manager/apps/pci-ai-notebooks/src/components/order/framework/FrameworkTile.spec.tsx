import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import FrameworkTile from './FrameworkTile.component';
import { mockedFrameworkTer } from '@/__tests__/helpers/mocks/notebook/framework';

describe('Framework Tile component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display FrameworkTile with Version Selector', async () => {
    render(
      <FrameworkTile
        framework={mockedFrameworkTer}
        version={mockedFrameworkTer.versions[0]}
        selected={false}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId(`fmk-radio-tile-${mockedFrameworkTer.id}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('fmk-tile-version-container'),
      ).toBeInTheDocument();
    });
  });

  it('should trigger callback when selected', async () => {
    render(
      <FrameworkTile
        framework={mockedFrameworkTer}
        version={mockedFrameworkTer.versions[0]}
        selected={false}
        onChange={onChange}
      />,
    );
    const fmkRadioTileId = `fmk-radio-tile-${mockedFrameworkTer.id}`;
    await waitFor(() => {
      expect(screen.getByTestId(fmkRadioTileId)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId(fmkRadioTileId));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
