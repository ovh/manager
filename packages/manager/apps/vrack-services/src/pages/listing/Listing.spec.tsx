import { describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';

describe('KMS listing test suite', () => {
  it('should redirect to the onboarding page when the kms list is empty', async () => {
    await renderTestApp('/', {});

    expect(screen.getByText(labels.onboarding.onboardingPageTitle)).toBeVisible();

    expect(
      screen.queryByText(labels.listing.listingTitle),
    ).not.toBeInTheDocument();
  });
});
