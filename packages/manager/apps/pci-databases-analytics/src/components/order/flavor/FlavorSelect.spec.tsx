import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import FlavorsSelect from '@/components/order/flavor/FlavorSelect.component';
import { mockedBasicOrderFunnelFlavor } from '@/__tests__/helpers/mocks/order-funnel';
import { Flavor } from '@/types/orderFunnel';

describe('FlavorsSelect component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the Flavor-Select table', async () => {
    const onChange = vi.fn();
    render(
      <FlavorsSelect
        flavors={[mockedBasicOrderFunnelFlavor]}
        onChange={onChange}
        showMonthlyPrice={true}
        value=""
      />,
    );
    await waitFor(() => {
      const flavorRowTestId = `flavor-table-row-${mockedBasicOrderFunnelFlavor.name}`;
      expect(screen.getByTestId('flavor-select-table')).toBeInTheDocument();
      expect(
        screen.getByTestId('flavor-select-table-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('flavor-select-table-body'),
      ).toBeInTheDocument();
      expect(screen.getByTestId(flavorRowTestId)).toBeInTheDocument();
    });
  });

  it('should trigger callback when data row is clicked', async () => {
    const onChange = vi.fn();
    const flavorWithFixedStorage: Flavor = {
      ...mockedBasicOrderFunnelFlavor,
      storage: {
        minimum: { unit: 'GB', value: 10 },
        maximum: { unit: 'GB', value: 10 },
      },
    };
    render(
      <FlavorsSelect
        flavors={[flavorWithFixedStorage]}
        onChange={onChange}
        showMonthlyPrice={true}
        value=""
      />,
    );
    act(() => {
      const flavorRowTestId = `flavor-table-row-${flavorWithFixedStorage.name}`;
      fireEvent.click(screen.getByTestId(flavorRowTestId));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(flavorWithFixedStorage.name);
    });
  });

  it('should trigger callback Onchange onKeyDown Enter', async () => {
    const onChange = vi.fn();
    const flavorWithStorage: Flavor = {
      ...mockedBasicOrderFunnelFlavor,
      storage: {
        minimum: { unit: 'GB', value: 10 },
        maximum: { unit: 'GB', value: 20 },
      },
    };
    render(
      <FlavorsSelect
        flavors={[flavorWithStorage]}
        onChange={onChange}
        showMonthlyPrice={true}
        value=""
      />,
    );
    act(() => {
      const flavorRowTestId = `flavor-table-row-${flavorWithStorage.name}`;
      fireEvent.keyDown(screen.getByTestId(flavorRowTestId), {
        key: 'Enter',
      });
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(flavorWithStorage.name);
    });
  });

  it('should not trigger callback Onchange onKeyDown o', async () => {
    const onChange = vi.fn();
    render(
      <FlavorsSelect
        flavors={[mockedBasicOrderFunnelFlavor]}
        onChange={onChange}
        showMonthlyPrice={true}
        value=""
      />,
    );
    act(() => {
      const flavorRowTestId = `flavor-table-row-${mockedBasicOrderFunnelFlavor.name}`;
      fireEvent.keyDown(screen.getByTestId(flavorRowTestId), {
        key: 'o',
      });
    });
    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
