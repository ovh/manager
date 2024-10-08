import { screen } from '@testing-library/react';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';

describe('KMS listing test suite', () => {
  it('should redirect to the onboarding page when the kms list is empty', async () => {
    await renderTestApp({ nbLicenseHycu: 0 });
  });
});
