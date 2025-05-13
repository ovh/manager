import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import EngineTile from '@/components/order/engine/EngineTile.component';
import {
  mockedEngineVersion,
  mockedOrderFunnelEngine,
} from '@/__tests__/helpers/mocks/order-funnel';

describe('EngineTile component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the EngineTile With VersionSelector', async () => {
    const onChange = vi.fn();
    render(
      <EngineTile
        engine={mockedOrderFunnelEngine}
        version={mockedEngineVersion}
        selected={false}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      const BadgeTestId = `Badge${mockedOrderFunnelEngine.tags[0]}`;
      expect(screen.getByTestId('engine-radio-tile')).toBeInTheDocument();
      expect(screen.getByTestId(BadgeTestId)).toBeInTheDocument();
      expect(
        screen.getByTestId('engine-tile-version-container'),
      ).toBeInTheDocument();
    });
  });

  it('should trigger callback when selected', async () => {
    const onChange = vi.fn();
    render(
      <EngineTile
        engine={mockedOrderFunnelEngine}
        version={mockedEngineVersion}
        selected={false}
        onChange={onChange}
      />,
    );
    act(() => {
      fireEvent.click(screen.getByTestId('engine-radio-tile'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
