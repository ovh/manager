import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { PlanTile } from '@/components/Order/plan/plan-tile';
import { mockedBasicOrderFunnelPlan } from '@/__tests__/helpers/mocks/order-funnel';
import { Plan } from '@/models/order-funnel';

describe('PlanTile component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display the PlanTile With all element', async () => {
    const onChange = vi.fn();
    const fullPlan: Plan = {
      ...mockedBasicOrderFunnelPlan,
      ram: {
        minimum: { unit: 'GB', value: 100 },
        maximum: { unit: 'GB', value: 300 },
      },
      cpu: {
        minimum: 1,
        maximum: 5,
      },
      storage: {
        minimum: { unit: 'GB', value: 100 },
        maximum: { unit: 'GB', value: 300 },
      },
    };
    render(
      <PlanTile
        plan={fullPlan}
        selected={false}
        onChange={onChange}
        showMonthlyPrice={true}
      />,
    );
    await waitFor(() => {
      const BadgeTestId = `plan-tile-badge-${fullPlan.tags[0]}`;
      expect(screen.getByTestId('plan-tile-radio-tile')).toBeInTheDocument();
      expect(screen.getByTestId(BadgeTestId)).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-ram-range')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-cpu-range')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-storage-range')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-nodes-range')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-price')).toBeInTheDocument();
    });
  });

  it('Ram, CPU, Storage, Nodes should not be displayed', async () => {
    const onChange = vi.fn();
    const noNodesPlan: Plan = {
      ...mockedBasicOrderFunnelPlan,
      nodes: {
        maximum: 0,
        minimum: 0,
      },
    };
    render(
      <PlanTile
        plan={noNodesPlan}
        selected={true}
        onChange={onChange}
        showMonthlyPrice={true}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByTestId('plan-tile-ram')).toBeNull();
      expect(screen.queryByTestId('plan-tile-cpu')).toBeNull();
      expect(screen.queryByTestId('plan-tile-storage')).toBeNull();
      expect(screen.queryByTestId('plan-tile-nodes')).toBeNull();
    });
  });

  it('Should displayed CPU, Storage, Ram, Node in spec and not range', async () => {
    const onChange = vi.fn();
    const noRangePlan: Plan = {
      ...mockedBasicOrderFunnelPlan,
      ram: {
        minimum: { unit: 'GB', value: 100 },
        maximum: { unit: 'GB', value: 100 },
      },
      cpu: {
        minimum: 1,
        maximum: 1,
      },
      storage: {
        minimum: { unit: 'GB', value: 100 },
        maximum: { unit: 'GB', value: 100 },
      },
      nodes: {
        minimum: 1,
        maximum: 1,
      },
    };
    render(
      <PlanTile
        plan={noRangePlan}
        selected={true}
        onChange={onChange}
        showMonthlyPrice={false}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('plan-tile-ram-spec')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-cpu-spec')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-storage-spec')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-nodes-spec')).toBeInTheDocument();
    });
  });

  it('should trigger callback when selected', async () => {
    const onChange = vi.fn();
    render(
      <PlanTile
        plan={mockedBasicOrderFunnelPlan}
        selected={false}
        onChange={onChange}
        showMonthlyPrice={false}
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
