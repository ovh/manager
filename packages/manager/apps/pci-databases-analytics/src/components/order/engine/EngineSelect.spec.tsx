import {
  // act,
  // fireEvent,
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
    vi.mock('@ovh-ux/manager-react-shell-client', () => {
      type CallbackType = (localePros: { locale: string }) => void;
      let localeChangeCallback: CallbackType | null = null;
      const onLocaleChange = (callback: CallbackType) => {
        localeChangeCallback = callback;
      };
      return {
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(),
            onLocaleChange,
            setLocale: vi.fn((newLocale: string) => {
              if (localeChangeCallback) {
                localeChangeCallback({ locale: newLocale });
              }
            }),
          },
        })),
      };
    });
  });
  it('should display the EngineTile', async () => {
    const onChange = vi.fn();
    render(
      <EngineSelect
        engines={[mockedOrderFunnelEngine]}
        value={mockedOrderFunnelEngine.name}
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
        value={mockedOrderFunnelEngine.name}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('engines-select-container'),
      ).toBeInTheDocument();
    });
  });

  // it('should trigger callback when selected', async () => {
  //   const onChange = vi.fn();
  //   render(
  //     <EngineSelect
  //       engines={[mockedOrderFunnelEngine]}
  //       value={mockedOrderFunnelEngine.name}
  //       onChange={onChange}
  //     />,
  //   );
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('engine-radio-tile'));
  //   });
  //   await waitFor(() => {
  //     expect(onChange).toHaveBeenCalled();
  //   });
  // });
});
