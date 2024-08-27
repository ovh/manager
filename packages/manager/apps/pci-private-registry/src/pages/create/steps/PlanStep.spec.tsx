import { render } from '@testing-library/react';
import { wrapper } from '@/wrapperRenders';
import PlanStep from '@/pages/create/steps/PlanStep';

const compute = () => render(<PlanStep />, { wrapper });

describe('PlanStep', () => {
  it('should render', () => {
    const { container } = compute();
    expect(container).toMatchSnapshot();
  });
});
