import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import FlavorsSelect from './FlavorSelect.component';
import {
  mockedOrderFlavorCPU,
  mockedOrderFlavorGPU,
} from '@/__tests__/helpers/mocks/capabilities/flavor';

describe('Flavor table select component', () => {
  beforeEach(() => {
    vi.mock('@/data/hooks/catalog/useGetCatalog.hook', () => {
      return {
        useGetCatalog: vi.fn(() => ({
          isSuccess: true,
          data: {
            locale: {
              currencyCode: 'EUR',
            },
          },
        })),
      };
    });
    vi.mock('@/hooks/useLocale', () => {
      return {
        useLocale: vi.fn(() => 'fr_FR'),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display the Flavor select table', async () => {
    render(
      <FlavorsSelect
        flavors={[mockedOrderFlavorCPU, mockedOrderFlavorGPU]}
        value={mockedOrderFlavorCPU.id}
        resourcesQuantity={1}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('flavor-select-table')).toBeInTheDocument();
      expect(
        screen.getByTestId('flavor-select-table-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('flavor-select-table-body'),
      ).toBeInTheDocument();
    });
  });
  it('should trigger callback when selected', async () => {
    render(
      <FlavorsSelect
        flavors={[mockedOrderFlavorCPU, mockedOrderFlavorGPU]}
        value={mockedOrderFlavorCPU.id}
        resourcesQuantity={1}
        onChange={onChange}
      />,
    );
    const flavorRowTestId = `flavor-table-row-${mockedOrderFlavorGPU.id}`;
    await waitFor(() => {
      expect(screen.getByTestId(flavorRowTestId)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId(flavorRowTestId));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(mockedOrderFlavorGPU.id);
    });
  });
  it('should trigger callback Onchange onKeyDown Enter', async () => {
    render(
      <FlavorsSelect
        flavors={[mockedOrderFlavorCPU, mockedOrderFlavorGPU]}
        value={mockedOrderFlavorCPU.id}
        resourcesQuantity={1}
        onChange={onChange}
      />,
    );
    const flavorRowTestId = `flavor-table-row-${mockedOrderFlavorGPU.id}`;
    await waitFor(() => {
      expect(screen.getByTestId(flavorRowTestId)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByTestId(flavorRowTestId), {
        key: 'Enter',
      });
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(mockedOrderFlavorGPU.id);
    });
  });

  it('should not trigger callback Onchange onKeyDown o', async () => {
    render(
      <FlavorsSelect
        flavors={[mockedOrderFlavorCPU, mockedOrderFlavorGPU]}
        value={mockedOrderFlavorCPU.id}
        resourcesQuantity={1}
        onChange={onChange}
      />,
    );
    const flavorRowTestId = `flavor-table-row-${mockedOrderFlavorGPU.id}`;
    await waitFor(() => {
      expect(screen.getByTestId(flavorRowTestId)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByTestId(flavorRowTestId), {
        key: 'o',
      });
    });
    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
