import { setupSpecTest } from './setup';

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
});
