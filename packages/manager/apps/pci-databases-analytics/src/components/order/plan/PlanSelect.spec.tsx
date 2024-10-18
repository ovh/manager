import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import PlansSelect from '@/components/order/plan/PlanSelect.component';
import { mockedBasicOrderFunnelPlan } from '@/__tests__/helpers/mocks/order-funnel';

describe('PlansSelect component', () => {
  beforeEach(() => {
    vi.mock('@/hooks/api/catalog/useGetCatalog.hook', () => {
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

  it('should display the plan tile', async () => {
    const onChange = vi.fn();
    render(
      <PlansSelect
        plans={[mockedBasicOrderFunnelPlan]}
        value={'plan1'}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('plans-select-container')).toBeInTheDocument();
    });
  });

  it('should trigger callback when selected', async () => {
    const onChange = vi.fn();
    render(
      <PlansSelect
        plans={[mockedBasicOrderFunnelPlan]}
        value={'plan1'}
        onChange={onChange}
      />,
    );
    act(() => {
      fireEvent.click(screen.getByTestId('plan-tile-radio-tile'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
