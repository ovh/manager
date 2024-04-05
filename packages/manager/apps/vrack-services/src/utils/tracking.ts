import { AT_INTERNET_LEVEL2 } from '@ovh-ux/ovh-at-internet';

export const APP_NAME = 'vrack-services';
export const chapter1 = 'Baremetal';
export const chapter2 = 'Network';
export const chapter3 = APP_NAME;
export const PREFIX = [chapter1, chapter2, chapter3].join('::');

export const PAGE_THEME = 'DedicatedServers';
export const SITE_LEVEL2 = `Manager-${PAGE_THEME}`;
export const LEVEL2 = Object.entries(AT_INTERNET_LEVEL2).find(
  ([, value]) => value === SITE_LEVEL2,
)?.[0];

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
  datagrid = 'data-grid',
}

export enum ButtonType {
  button = 'button',
  link = 'link',
  select = 'select',
  externalLink = 'external-link',
  tile = 'tile',
  tutorial = 'tile-tutorial',
}

export enum PageName {
  associate = 'associate',
  createVrack = 'create-vrack',
  delete = 'delete_vrack-services',
  createVrackServices = 'add_vrack-services',
  overview = 'general-informations',
  subnets = 'subnets',
  createSubnets = 'add_subnets',
  deleteSubnets = 'delete_subnets',
  endpoints = 'endpoints',
  createEndpoints = 'add_endpoints',
  deleteEndpoints = 'delete_endpoints',

  pendingCreateSubnet = 'create_subnet_pending',
  errorCreateSubnet = 'create_subnet_error',
  pendingUpdateSubnet = 'update_subnet_pending',
  errorUpdateSubnet = 'update_subnet_error',
  pendingDeleteSubnet = 'delete_subnet_pending',
  errorDeleteSubnet = 'delete_subnet_error',

  pendingCreateEndpoint = 'create_endpoint_pending',
  errorCreateEndpoint = 'create_endpoint_error',
  pendingUpdateEndpoint = 'update_endpoint_pending',
  errorUpdateEndpoint = 'update_endpoint_error',
  pendingDeleteEndpoint = 'delete_endpoint_pending',
  errorDeleteEndpoint = 'delete_endpoint_error',

  pendingCreateVrackServices = 'create_vrack-services_pending',
  errorCreateVrackServices = 'create_vrack-services_error',
  pendingUpdateVrackServices = 'update_vrack-services_pending',
  errorUpdateVrackServices = 'update_vrack-services_error',
  pendingDeleteVrackServices = 'delete_vrack-services_pending',
  errorDeleteVrackServices = 'delete_vrack-services_error',
}

export type TrackingPageParams = {
  pageType?: PageType;
  pageName?: PageName;
};

export const getPageProps = ({ pageType, pageName }: TrackingPageParams) => ({
  name: [PREFIX, APP_NAME, pageType, pageName].filter(Boolean).join('::'),
  page: [APP_NAME, pageType, pageName].filter(Boolean).join('::'),
  page_category: pageType,
  page_theme: PAGE_THEME,
  type: 'display',
  level2: LEVEL2,
});

export type TrackingClickParams = {
  location?: PageLocation;
  pageType?: PageType;
  pageName?: PageName;
  buttonType?: ButtonType;
  actions?: string[];
  actionType?: 'action' | 'navigation' | 'download' | 'exit';
};

export const getClickProps = ({
  location,
  pageType,
  pageName,
  buttonType,
  actions = [],
  actionType = 'action',
}: TrackingClickParams) => ({
  name: [PREFIX, location, buttonType, pageName, ...actions]
    .filter(Boolean)
    .join('::'),
  page: getPageProps({ pageType, pageName }),
  page_theme: PAGE_THEME,
  type: actionType,
  level2: LEVEL2,
});
