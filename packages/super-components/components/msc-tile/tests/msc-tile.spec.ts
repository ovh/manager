import { setupSpecTest, footerSlotExample, badgesSlotExample } from './setup';

describe('specs:msc-tile', () => {
  it('renders without error', async () => {
    const { page } = await setupSpecTest({});

    expect(page.root?.shadowRoot).toBeTruthy();
    expect(page.rootInstance).toBeTruthy();
  });

  describe('contents', () => {
    it('should have a badges slot', async () => {
      const { badgesSlot } = await setupSpecTest({
        html: badgesSlotExample,
      });
      expect(badgesSlot).toBeTruthy();
    });

    it('should have a footer slot', async () => {
      const { footerSlot } = await setupSpecTest({
        html: footerSlotExample,
      });
      expect(footerSlot).toBeTruthy();
    });
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
