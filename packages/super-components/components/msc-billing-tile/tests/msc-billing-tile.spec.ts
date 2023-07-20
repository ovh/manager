import { setupSpecTest } from './setup';

jest.mock('@ovh-ux/manager-core-api', () => jest.fn());

describe('specs:msc-billing-tile', () => {
  it('renders without error', async () => {
    const { page } = await setupSpecTest({});

    expect(page.root?.shadowRoot).toBeTruthy();
    expect(page.rootInstance).toBeTruthy();
  });

  it('Language should be french and title is "Abonnement"', async () => {
    const { page } = await setupSpecTest({});

    const element = page.root?.shadowRoot?.querySelector('*');
    expect(element).not.toBeNull();
    expect(element?.textContent).toContain('Abonnement');
  });

  it('Language should be english and title is "Subscription"', async () => {
    const { page } = await setupSpecTest({
      attributes: { language: 'en-GB' },
    });

    const element = page.root?.shadowRoot?.querySelector('*');
    expect(element).not.toBeNull();
    expect(element?.textContent).toContain('Subscription');
  });

  describe('tracking', () => {
    it('should put the tracking attribute on the inner link', async () => {
      const testTrackingLabel = 'test';
      const { innerLink } = await setupSpecTest({
        attributes: { dataTracking: testTrackingLabel },
      });
      expect(innerLink).toEqualAttribute('data-tracking', testTrackingLabel);
    });
  });

  describe('chips', () => {
    it('renders chip with correct color and text for each status', async () => {
      const { page } = await setupSpecTest({
        attributes: { language: 'en-GB' },
      });
      // Mock getTranslation method
      page.rootInstance.getTranslation = jest.fn((key) => key);

      const statuses = [
        'deleteAtExpiration',
        'automatic',
        'manualPayment',
        'cancelled',
      ];
      const expectedColors = [
        'OdsThemeColorIntent.error',
        'OdsThemeColorIntent.accent',
        'OdsThemeColorIntent.warning',
        'OdsThemeColorIntent.error',
      ];
      const expectedTexts = statuses.map(
        (status) => `mb_service_status_${status}`,
      );

      statuses.forEach((status, i) => {
        page.rootInstance.renewStatus = status;

        const chip = page.root?.querySelector('osds-chip');
        expect(chip).toHaveAttribute('color', expectedColors[i]);
        expect(chip).toHaveTextContent(expectedTexts[i]);
      });
    });
  });
});
