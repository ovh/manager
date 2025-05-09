import { render } from '@testing-library/react';
import AddObjectPage from './AddObject.page';
import { wrapper } from '@/wrapperRenders';

describe('AddObjectPage', () => {
  it('should display correctly', () => {
    const { container } = render(<AddObjectPage />, { wrapper });
    expect(container).toMatchSnapshot();
  });
});
