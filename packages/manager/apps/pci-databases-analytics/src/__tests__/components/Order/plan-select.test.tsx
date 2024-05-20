import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import PlansSelect from '@/components/Order/plan/plan-select';
import { mockedBasicOrderFunnelPlan } from '@/__tests__/helpers/mocks/order-funnel';

describe('PlanSelect component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display the PlanTile', async () => {
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
