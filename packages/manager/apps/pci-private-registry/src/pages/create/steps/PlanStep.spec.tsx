import { render } from '@testing-library/react';
import { wrapper } from '@/wrapperRenders';
import PlanStep from '@/pages/create/steps/PlanStep';

describe('PlanStep', () => {
  it('should render', () => {
    const compute = () => render(<PlanStep />, { wrapper });
    const { container } = compute();
    expect(container).toMatchSnapshot();
  });
});
