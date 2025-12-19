import {
  ShellContext,
  getPageProps,
  getClickProps,
  TrackingPageParams,
  TrackingClickParams,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { useMatches } from 'react-router-dom';
import { TrackingSubApps, TRACKING_CONTEXT } from '@/tracking.constant';

export type CommunicationTrackingPageParams = TrackingPageParams & {
  subApp: TrackingSubApps;
};

export type CommunicationTrackingClickParams = TrackingClickParams &
  TrackingPageParams & {
    subApp: TrackingSubApps;
  };

export const usePageTracking = ():
  | CommunicationTrackingPageParams
  | undefined => {
  const matches = useMatches();
  if (matches.length === 0) return undefined;

  const lastMatch = matches[matches.length - 1];

  if (lastMatch && typeof lastMatch.handle === 'object') {
    const handle = lastMatch.handle as {
      tracking: CommunicationTrackingPageParams;
    };
    return handle.tracking;
  }

  return undefined;
};

export const useTracking = () => {
  const { shell, environment, tracking } = useContext(ShellContext);
  const pageTracking = usePageTracking();
  const region = environment?.getRegion();
  const level2 =
    (region && TRACKING_CONTEXT.level2Config[region]?.config?.level2) ||
    tracking?.level2;

  /**
   * @param pageName - the name of the page to track
   * @param pageType - the type of the page to track
   * @param subApp - the sub app to track
   * @example
   * trackPage({ pageName: 'subject', pageType: 'dashboard', subApp: 'communications' });
   * // will track page with name: 'Communications::communications::communications::communications::dashboard::subject'
   * // will track page with page: 'communication::dashboard::subject'
   */
  const trackPage = ({
    pageName,
    pageType,
    subApp,
  }: CommunicationTrackingPageParams) => {
    shell.tracking.trackPage(
      getPageProps({
        ...TRACKING_CONTEXT,
        chapter2: subApp,
        chapter3: subApp,
        appName: subApp,
        pageName,
        pageType,
        level2,
      }),
    );
  };

  const trackInfoBanner = ({
    pageName,
    subApp,
  }: Omit<CommunicationTrackingPageParams, 'pageType'>) =>
    trackPage({
      pageName,
      pageType: PageType.bannerInfo,
      subApp,
    });
  const trackErrorBanner = ({
    pageName,
    subApp,
  }: Omit<CommunicationTrackingPageParams, 'pageType'>) =>
    trackPage({
      pageName,
      pageType: PageType.bannerError,
      subApp,
    });

  const trackClick = ({
    subApp,
    location,
    buttonType,
    actions,
    actionType,
  }: CommunicationTrackingClickParams) => {
    shell.tracking.trackClick(
      getClickProps({
        ...TRACKING_CONTEXT,
        ...pageTracking,
        chapter2: subApp,
        chapter3: subApp,
        appName: subApp,
        location,
        buttonType,
        actions,
        actionType,
        level2,
      }),
    );
  };

  return {
    trackPage,
    trackClick,
    trackErrorBanner,
    trackInfoBanner,
  };
};

export default useTracking;
