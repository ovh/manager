import { render } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { StepComponent } from '@ovhcloud/manager-components';
import { wrapper } from '@/wrapperRenders';
import NameStep from '@/pages/create/steps/NameStep';

const compute = () => render(<NameStep />, { wrapper });

describe('NameStep', () => {
  vi.mock('@ovhcloud/manager-components', (importOriginal) => ({
    ...importOriginal,
    StepComponent: vi
      .fn()
      .mockImplementation(() => (
        <div data-testid="StepComponent">StepComponent</div>
      )),
  }));

  it.skip('should render', () => {
    const { container } = compute();
    expect(container).toMatchSnapshot();
  });

  it('should render StepComponent', () => {
    compute();

    const spy = StepComponent as Mock;

    const { mock } = spy;

    console.log(mock.calls[0][0]);

    expect(spy).toHaveBeenCalled();
  });
});
