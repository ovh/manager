import React from 'react';
import { AT_INTERNET_LEVEL2 } from '@ovh-ux/ovh-at-internet';
import { ShellContext } from '../ShellContext';

export const getLevel2TrackingParam = (universe: string) => {
  const result = Object.keys(AT_INTERNET_LEVEL2).filter((element) =>
    AT_INTERNET_LEVEL2[element].toLowerCase().indexOf(universe.toLowerCase()) >
    -1
      ? element
      : false,
  );
  return result ? result[0] : '0';
};

export type TrackingParams = {
  name: string;
  page: { name: string } & Record<string, string>;
  page_category: string;
  complete_page_name: string;
  level2: string;
  type?: string;
  page_theme: string;
};

export type TrackingProps = {
  path: string;
  value?: string;
  type?: 'action' | 'display';
  pageParams?: Record<string, string> & { category?: 'pop-up' };
};

export type GetTrackingParamsProps = {
  universe: string;
  applicationName: string;
} & TrackingProps;

export const getTrackingParams = ({
  universe,
  path,
  applicationName,
  value,
  type,
  pageParams = {},
}: GetTrackingParamsProps): TrackingParams => {
  const page = [applicationName, path].join('::');
  const name = value ? `${page}${value}` : page;

  const params = {
    name,
    page: { name: page, ...pageParams },
    page_category: path || 'homepage',
    complete_page_name: page,
    level2: getLevel2TrackingParam(universe),
    type,
    page_theme: applicationName,
  };
  if (window.location.hostname === 'localhost') {
    console.log('Tracking sent', params);
  }
  return params;
};

export const useOvhTracking = () => {
  const { environment, shell } = React.useContext(ShellContext);
  const { applicationName, universe } = environment;

  return {
    trackClick: (props: TrackingProps) =>
      shell.tracking.trackClick(
        getTrackingParams({
          universe,
          applicationName,
          type: 'action',
          ...props,
        }),
      ),
    trackEvent: (props: TrackingProps) =>
      shell.tracking.trackEvent(
        getTrackingParams({
          universe,
          applicationName,
          ...props,
        }),
      ),
    trackClickImpression: (props: TrackingProps) =>
      shell.tracking.trackClickImpression(
        getTrackingParams({
          universe,
          applicationName,
          ...props,
        }),
      ),
    trackMVTest: (props: TrackingProps) =>
      shell.tracking.trackMVTest(
        getTrackingParams({
          universe,
          applicationName,
          ...props,
        }),
      ),
    trackPage: (props: TrackingProps) =>
      shell.tracking.trackPage(
        getTrackingParams({
          universe,
          applicationName,
          type: 'display',
          ...props,
        }),
      ),
  };
};

export default useOvhTracking;
