import { Shell } from '@ovh-ux/shell';

type PageTrackingData = {
  name: string;
  level2?: string;
  page_category?: string;
  page_theme?: string;
  [key: string]: unknown;
};

// page displays that are not a navigation to a new page (banners, modals)
const IGNORED_PAGE_CATEGORY = /^(banner|pop-up)/;

let currentPage: PageTrackingData | null = null;

/**
 * Keep track of the last page display sent by the applications, so that
 * clicks tracked by the container can be attached to the page being viewed.
 */
export function setupCurrentPageTracking(shell: Shell) {
  const trackingPlugin = shell.getPlugin('tracking');
  const trackPage = trackingPlugin.trackPage.bind(trackingPlugin);

  trackingPlugin.trackPage = (data: PageTrackingData) => {
    if (data?.name && !IGNORED_PAGE_CATEGORY.test(data.page_category || '')) {
      currentPage = data;
    }
    return trackPage(data);
  };
}

type CurrentPageTracking = {
  page?: { name: string };
  level2?: string;
  page_category?: string;
  page_theme?: string;
};

export function getCurrentPageTracking(): CurrentPageTracking {
  if (!currentPage) {
    return {};
  }
  const { name, level2, page_category, page_theme } = currentPage;
  return {
    page: { name },
    ...(level2 && { level2 }),
    ...(page_category && { page_category }),
    ...(page_theme && { page_theme }),
  };
}
