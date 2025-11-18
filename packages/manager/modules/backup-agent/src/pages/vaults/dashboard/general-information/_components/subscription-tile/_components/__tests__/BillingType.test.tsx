import { render } from '@testing-library/react';

import { BillingType } from '../BillingType.component';

describe('BillingType component a11y', () => {
  it('Should render BillingType component', async () => {
    const { container } = render(<BillingType />);

    await expect(container).toBeAccessible();
  });
});
