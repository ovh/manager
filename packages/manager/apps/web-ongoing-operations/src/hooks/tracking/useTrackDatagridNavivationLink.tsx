import {
  useOvhTracking,
  ButtonType,
  PageLocation,
} from '@ovh-ux/manager-react-shell-client';
import { GO_TO } from '@/tracking.constant';

export function useTrackNavigation() {
  const { trackClick } = useOvhTracking();

  const trackNavigationLink = (
    location: PageLocation,
    buttonType: ButtonType,
    url: string,
  ) => {
    trackClick({
      location,
      actionType: 'navigation',
      buttonType,
      actions: [GO_TO(url)],
    });
  };

  const trackDatagridNavivationLink = (url: string) => {
    trackNavigationLink(PageLocation.datagrid, ButtonType.link, url);
  };

  const trackDatagridNavivationButton = (url: string) => {
    trackNavigationLink(PageLocation.datagrid, ButtonType.button, url);
  };

  const trackPageNavivationLink = (url: string, isExternal = false) => {
    trackNavigationLink(
      PageLocation.page,
      isExternal ? ButtonType.externalLink : ButtonType.link,
      url,
    );
  };

  const trackPageNavivationButton = (url: string) => {
    trackNavigationLink(PageLocation.page, ButtonType.button, url);
  };

  const trackPageNavivationTile = (url: string) => {
    trackNavigationLink(PageLocation.page, ButtonType.tile, url);
  };

  const trackPageNavivationTab = (url: string) => {
    trackNavigationLink(PageLocation.page, ButtonType.tab, url);
  };

  const trackTileNavivationLink = (url: string, isExternal = false) => {
    trackNavigationLink(
      PageLocation.tile,
      isExternal ? ButtonType.externalLink : ButtonType.link,
      url,
    );
  };

  return {
    trackDatagridNavivationLink,
    trackDatagridNavivationButton,
    trackPageNavivationLink,
    trackPageNavivationButton,
    trackPageNavivationTile,
    trackPageNavivationTab,
    trackTileNavivationLink,
  };
}
