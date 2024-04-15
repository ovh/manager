import React from 'react';
import { AT_INTERNET_LEVEL2 } from '@ovh-ux/ovh-at-internet';
import { useMatches } from 'react-router-dom';
import { ShellContext, TrackingContextParams } from '../ShellContext';

export const getLevel2TrackingParam = (universe: string) => {
  const result = Object.keys(AT_INTERNET_LEVEL2).filter((element) =>
    AT_INTERNET_LEVEL2[element].toLowerCase().indexOf(universe.toLowerCase()) >
    -1
      ? element
      : false,
  );
  return result ? result[0] : '0';
};

export const sanitizeLabel = (label: string) =>
  label.replace(/\s/g, '_').replace(/:/g, '');

export enum PageType {
  onboarding = 'onboarding',
  listing = 'listing',
  dashboard = 'dashboard',
  popup = 'pop-up',
  bannerSuccess = 'banner-success',
  bannerError = 'banner-error',
  bannerInfo = 'banner-info',
  bannerWarning = 'banner-warning',
  funnel = 'funnel',
}

export enum PageLocation {
  page = 'page',
  funnel = 'funnel',
  banner = 'banner',
  popup = 'pop-up',
  datagrid = 'datagrid',
  tile = 'tile',
}

export enum ButtonType {
  button = 'button',
  link = 'link',
  select = 'select',
  externalLink = 'external-link',
  tile = 'tile',
  tutorial = 'tile-tutorial',
  tab = 'go-to-tab',
}

export type TrackingPageParams = {
  pageType?: PageType;
  pageName?: string;
};

export const getPageProps = ({
  chapter1,
  chapter2,
  chapter3,
  level2,
  appName,
  pageTheme,
  pageType,
  pageName,
}: TrackingPageParams & TrackingContextParams) => ({
  name: [chapter1, chapter2, chapter3, appName, pageType, pageName]
    .filter(Boolean)
    .map(sanitizeLabel)
    .join('::'),
  page: [appName, pageType, pageName].filter(Boolean).join('::'),
  page_category: pageType,
  page_theme: pageTheme,
  type: 'display',
  level2,
});

export type TrackingClickParams = {
  location?: PageLocation;
  buttonType?: ButtonType;
  actions?: string[];
  actionType?: 'action' | 'navigation' | 'download' | 'exit';
};

export const getClickProps = ({
  pageName,
  pageType,
  chapter1,
  chapter2,
  chapter3,
  appName,
  pageTheme,
  level2,
  location,
  buttonType,
  actions = [],
  actionType = 'action',
}: TrackingClickParams & TrackingPageParams & TrackingContextParams) => ({
  name: [chapter1, chapter2, chapter3, location, buttonType, ...actions]
    .filter(Boolean)
    .map(sanitizeLabel)
    .join('::'),
  page: getPageProps({
    chapter1,
    chapter2,
    chapter3,
    appName,
    pageName,
    pageType,
  }),
  page_category: pageType,
  page_theme: pageTheme,
  type: actionType,
  level2,
});

export const usePageTracking = () => {
  const matches = useMatches();
  const { handle } = matches[matches.length - 1];
  return (handle as any)?.tracking as TrackingPageParams;
};

export const useOvhTracking = () => {
  const pageTracking = usePageTracking();
  const { shell, tracking } = React.useContext(ShellContext);

  return {
    trackCurrentPage: () => {
      if (tracking && pageTracking) {
        shell.tracking.trackPage(
          getPageProps({
            ...tracking,
            ...pageTracking,
          }),
        );
      }
    },
    trackPage: (params: TrackingPageParams) => {
      shell.tracking.trackPage(
        getPageProps({
          ...tracking,
          ...params,
        }),
      );
    },
    trackClick: ({
      location,
      buttonType,
      actions,
      actionType,
    }: TrackingClickParams) => {
      shell.tracking.trackClick(
        getClickProps({
          ...tracking,
          ...pageTracking,
          location,
          buttonType,
          actionType,
          actions,
        }),
      );
    },
  };
};

export default useOvhTracking;
