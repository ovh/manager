import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { RadioGroup } from '@datatr-ux/uxlib';
import EngineTile from '@/components/order/engine/EngineTile.component';
import {
  mockedEngineVersion,
  mockedOrderFunnelEngine,
} from '@/__tests__/helpers/mocks/order-funnel';

describe('EngineTile component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the EngineTile', async () => {
    render(
      <RadioGroup>
        <EngineTile engine={mockedOrderFunnelEngine} />
      </RadioGroup>,
    );
    await waitFor(() => {
      const BadgeTestId = `Badge${mockedOrderFunnelEngine.tags[0]}`;
      expect(screen.getByTestId('engine-radio-tile')).toBeInTheDocument();
      expect(screen.getByTestId(BadgeTestId)).toBeInTheDocument();
    });
  });

  // it('should trigger callback when selected', async () => {
  //   const onChange = vi.fn();
  //   render(<EngineTile engine={mockedOrderFunnelEngine} />);
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('engine-radio-tile'));
  //   });
  //   await waitFor(() => {
  //     expect(onChange).toHaveBeenCalled();
  //   });
  // });
});
