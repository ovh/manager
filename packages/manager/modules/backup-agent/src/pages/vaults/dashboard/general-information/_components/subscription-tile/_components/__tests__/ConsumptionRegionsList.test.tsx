import { render } from '@testing-library/react';

import { ConsumptionRegionsList } from '../ConsumptionRegionsList.component';

describe('ConsumptionRegionsList component a11y', () => {
  it.skip('Should render ConsumptionRegionsList component', async () => {
    const { container } = render(<ConsumptionRegionsList />);

    await expect(container).toBeAccessible();
  });
});
