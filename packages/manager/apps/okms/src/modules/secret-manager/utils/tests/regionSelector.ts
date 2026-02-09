import { screen, waitFor } from '@testing-library/react';

import { TIMEOUT } from '@/common/utils/tests/uiTestHelpers';

export const assertRegionSelectorIsVisible = async () => {
  await waitFor(
    () => {
      const regionSelector = screen.getByRole('button', { name: 'Europe (France - Roubaix)' });
      expect(regionSelector).not.toHaveAttribute('loading');
    },
    { timeout: TIMEOUT.MEDIUM },
  );
};
