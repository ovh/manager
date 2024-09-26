import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import EngineSelect from '@/components/order/engine/EngineSelect.component';
import { mockedOrderFunnelEngine } from '@/__tests__/helpers/mocks/order-funnel';
import { Engine } from '@/types/orderFunnel';

describe('EngineSelect component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the EngineTile', async () => {
    const onChange = vi.fn();
    render(
      <EngineSelect
        engines={[mockedOrderFunnelEngine]}
        value={{
          engine: mockedOrderFunnelEngine.name,
          version: mockedOrderFunnelEngine.versions[0].name,
        }}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('engines-select-container'),
      ).toBeInTheDocument();
    });
  });

  it('should display the EngineTile with default version', async () => {
    const onChange = vi.fn();
    const secondEngine: Engine = {
      ...mockedOrderFunnelEngine,
      default: false,
      name: 'secondEngineName',
      order: 2,
    };
    render(
      <EngineSelect
        engines={[mockedOrderFunnelEngine, secondEngine]}
        value={{
          engine: mockedOrderFunnelEngine.name,
          version: mockedOrderFunnelEngine.versions[0].name,
        }}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('engines-select-container'),
      ).toBeInTheDocument();
    });
  });

  it('should trigger callback when selected', async () => {
    const onChange = vi.fn();
    render(
      <EngineSelect
        engines={[mockedOrderFunnelEngine]}
        value={{
          engine: mockedOrderFunnelEngine.name,
          version: mockedOrderFunnelEngine.versions[0].name,
        }}
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
