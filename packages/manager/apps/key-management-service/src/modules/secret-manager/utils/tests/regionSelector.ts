import { waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { getOdsButtonByIcon } from '@/utils/tests/uiTestHelpers';

export const assertRegionSelectorIsVisible = async (container: HTMLElement) => {
  await waitFor(async () => {
    const regionSelector = await getOdsButtonByIcon({
      container,
      iconName: 'chevron-down',
    });
    expect(regionSelector).toHaveAttribute('is-loading', 'true');
  });

  await waitFor(async () => {
    const regionSelector = await getOdsButtonByIcon({
      container,
      iconName: 'chevron-down',
    });
    expect(regionSelector).toHaveAttribute('is-loading', 'false');
    expect(regionSelector).toHaveAttribute(
      'label',
      'Europe (France - Roubaix)',
    );
  }, WAIT_FOR_DEFAULT_OPTIONS);
};
