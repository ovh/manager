import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { labels, renderTest } from '../../test-utils';

describe('KMS listing test suite', () => {
  it('should redirect to the onboarding page when the kms list is empty', async () => {
    await renderTest();

    expect(
      screen.getByText(labels.onboarding.onboardingPageTitle),
    ).toBeVisible();

    expect(
      screen.queryByText(labels.listing.listingTitle),
    ).not.toBeInTheDocument();
  });
});
