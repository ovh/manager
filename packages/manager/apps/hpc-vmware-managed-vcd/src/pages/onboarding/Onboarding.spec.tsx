import { screen, waitFor } from '@testing-library/react';
import { renderTest, labels } from '../../test-utils';

describe('Onboarding Page', () => {
  it('display the onboarding page if there is no VCD Organization', async () => {
    await renderTest({ nbOrganization: 0 });
    await waitFor(() =>
      expect(
        screen.getByText(
          labels.onboarding.managed_vcd_onboarding_description_part1,
        ),
      ).toBeVisible(),
    );
  });
});
