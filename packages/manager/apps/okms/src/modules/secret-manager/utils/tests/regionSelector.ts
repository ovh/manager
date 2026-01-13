import { screen, waitFor } from '@testing-library/react';

import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';

export const assertRegionSelectorIsVisible = async () => {
  await waitFor(() => {
    const regionSelector = screen.getByRole('button', { name: 'Europe (France - Roubaix)' });
    expect(regionSelector).not.toHaveAttribute('loading');
  }, WAIT_FOR_DEFAULT_OPTIONS);
};
