import { it, vi, describe, expect, beforeEach } from 'vitest';
import { Shell } from '@ovh-ux/shell';

const trackPage = vi.fn();
const trackingPlugin = { trackPage };
const shell = ({
  getPlugin: () => trackingPlugin,
} as unknown) as Shell;

const hubDashboardPage = {
  name: 'hub::app::dashboard::dashboard',
  level2: '88',
  page_category: 'dashboard',
  page_theme: 'hub',
  type: 'display',
};

describe('core/tracking', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    trackingPlugin.trackPage = trackPage;
  });

  it('should return no page data when no page has been tracked', async () => {
    const { setupCurrentPageTracking, getCurrentPageTracking } = await import(
      '.'
    );
    setupCurrentPageTracking(shell);

    expect(getCurrentPageTracking()).toEqual({});
  });

  it('should still forward page tracking to the tracking plugin', async () => {
    const { setupCurrentPageTracking } = await import('.');
    setupCurrentPageTracking(shell);

    trackingPlugin.trackPage(hubDashboardPage);

    expect(trackPage).toHaveBeenCalledWith(hubDashboardPage);
  });

  it('should return the data of the last tracked page', async () => {
    const { setupCurrentPageTracking, getCurrentPageTracking } = await import(
      '.'
    );
    setupCurrentPageTracking(shell);

    trackingPlugin.trackPage(hubDashboardPage);

    expect(getCurrentPageTracking()).toEqual({
      page: { name: 'hub::app::dashboard::dashboard' },
      level2: '88',
      page_category: 'dashboard',
      page_theme: 'hub',
    });
  });

  it('should ignore banners and pop-ups displays', async () => {
    const { setupCurrentPageTracking, getCurrentPageTracking } = await import(
      '.'
    );
    setupCurrentPageTracking(shell);

    trackingPlugin.trackPage(hubDashboardPage);
    trackingPlugin.trackPage({
      ...hubDashboardPage,
      name: 'hub::app::dashboard::banner-info::kyc',
      page_category: 'banner-info',
    });
    trackingPlugin.trackPage({
      ...hubDashboardPage,
      name: 'hub::app::dashboard::pop-up::suggestion',
      page_category: 'pop-up',
    });

    expect(getCurrentPageTracking().page).toEqual({
      name: 'hub::app::dashboard::dashboard',
    });
  });
});
