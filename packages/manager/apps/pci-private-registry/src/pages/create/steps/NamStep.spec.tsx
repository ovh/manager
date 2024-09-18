import { render } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { wrapper } from '@/wrapperRenders';
import NameStep from '@/pages/create/steps/NameStep';

const compute = () => render(<NameStep />, { wrapper });

describe('NameStep', () => {
  vi.mock('@ovh-ux/manager-react-components', (importOriginal) => ({
    ...importOriginal,
    StepComponent: vi
      .fn()
      .mockImplementation(() => (
        <div data-testid="StepComponent">StepComponent</div>
      )),
  }));

  it('should render', () => {
    const { container } = compute();
    expect(container).toMatchSnapshot();
  });

  it('should render StepComponent', () => {
    compute();

    const spy = StepComponent as Mock;

    expect(spy).toHaveBeenCalled();
  });
});
