import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { RadioGroup } from '@datatr-ux/uxlib';
import { PlanTile } from '@/components/order/plan/PlanTile.component';
import { mockedBasicOrderFunnelPlan } from '@/__tests__/helpers/mocks/order-funnel';
import { Plan } from '@/types/orderFunnel';

describe('PlanTile component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display plan tile With all element', async () => {
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
      <RadioGroup>
        <PlanTile plan={fullPlan} />
      </RadioGroup>,
    );
    await waitFor(() => {
      const BadgeTestId = `plan-tile-badge-${fullPlan.tags[0]}`;
      expect(
        screen.getByTestId(
          `plan-tile-radio-tile-${mockedBasicOrderFunnelPlan.name}`,
        ),
      ).toBeInTheDocument();
      expect(screen.getByTestId(BadgeTestId)).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-ram-range')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-cpu-range')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-storage-range')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-nodes-range')).toBeInTheDocument();
    });
  });

  it('Ram, cpu, storage, nodes should not be displayed', async () => {
    const onChange = vi.fn();
    const noNodesPlan: Plan = {
      ...mockedBasicOrderFunnelPlan,
      nodes: {
        maximum: 0,
        minimum: 0,
      },
    };
    render(
      <RadioGroup>
        <PlanTile plan={noNodesPlan} />
      </RadioGroup>,
    );
    await waitFor(() => {
      expect(screen.queryByTestId('plan-tile-ram')).toBeNull();
      expect(screen.queryByTestId('plan-tile-cpu')).toBeNull();
      expect(screen.queryByTestId('plan-tile-storage')).toBeNull();
      expect(screen.queryByTestId('plan-tile-nodes')).toBeNull();
    });
  });

  it('Should displayed cpu, storage, ram, node in spec and not range', async () => {
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
      <RadioGroup>
        <PlanTile plan={noRangePlan} />
      </RadioGroup>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('plan-tile-ram-spec')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-cpu-spec')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-storage-spec')).toBeInTheDocument();
      expect(screen.getByTestId('plan-tile-nodes-spec')).toBeInTheDocument();
    });
  });
});
