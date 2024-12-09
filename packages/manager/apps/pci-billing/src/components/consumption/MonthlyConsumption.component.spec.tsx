import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MonthlyConsumption from './MonthlyConsumption.component';
import { wrapper } from '@/wrapperRenders';
import { TConsumptionDetail } from '@/api/hook/useConsumption';

describe('MonthlyConsumption Component', () => {
  it('matches snapshot', () => {
    const mockConsumption = {
      totals: {
        monthly: {
          instance: 100.5,
        },
      },
      monthlyInstances: [{ name: 'Test Instance', total: 50.25 }],
    };

    const { asFragment } = render(
      <MonthlyConsumption
        consumption={(mockConsumption as unknown) as TConsumptionDetail}
      />,
      { wrapper },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
