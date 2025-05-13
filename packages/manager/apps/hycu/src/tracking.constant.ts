import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';

export const LEVEL2 = {
  EU: {
    config: {
      level2: '120',
    },
  },
  CA: {
    config: {
      level2: '120',
    },
  },
  US: {
    config: {
      level2: '120',
    },
  },
} as const;
export const UNIVERSE = 'PrivateCloud';
export const SUB_UNIVERSE = 'storage-backup';
export const THEME = 'Enterprise_solutions';
export const APP_NAME = 'HYCU';

export const TRACKING: Record<
  string,
  Record<string, TrackingClickParams | any>
> = {
  breadcrumb: {
    homeClick: `breadcrumb::link::go-to-home`,
    hycuClick: `breadcrumb::link::go-to-hycu`,
  },
  onboarding: {
    beginClick: {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actions: [`start_${APP_NAME}`],
      actionType: 'action',
    },
    moreInfoClick: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-more-information_${APP_NAME}`],
      actionType: 'action',
    },
    guideClick: (guideName: string): TrackingClickParams => {
      return {
        location: PageLocation.page,
        buttonType: ButtonType.externalLink,
        actions: [`go-to-${guideName}_${APP_NAME}`],
        actionType: 'action',
      };
    },
  },
  listing: {
    orderClick: {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actions: [`order_${APP_NAME}`],
      actionType: 'action',
    },
    deleteClick: (packType: string): TrackingClickParams => {
      return {
        location: PageLocation.datagrid,
        buttonType: ButtonType.button,
        actions: [`delete_${APP_NAME}`, `${packType}`],
        actionType: 'action',
      };
    },
  },
  order: {
    goToSalesClick: {
      location: PageLocation.funnel,
      buttonType: ButtonType.link,
      actions: [`order_${APP_NAME}`, `go-to-sales-service_${APP_NAME}`],
      actionType: 'action',
    },
    selectPackClick: (packType: string): TrackingClickParams => {
      return {
        location: PageLocation.funnel,
        buttonType: ButtonType.tile,
        actions: [`order_${APP_NAME}`, `select_pack::${packType}`],
        actionType: 'action',
      };
    },
    orderClick: (packType: string): TrackingClickParams => {
      return {
        location: PageLocation.funnel,
        buttonType: ButtonType.button,
        actions: [`order_${APP_NAME}`, `go-to-order_${APP_NAME}_${packType}`],
        actionType: 'action',
      };
    },
    cancelClick: (packType: string): TrackingClickParams => {
      return {
        location: PageLocation.funnel,
        buttonType: ButtonType.button,
        actions: [`order_${APP_NAME}`, `cancel_${APP_NAME}_${packType}`],
        actionType: 'action',
      };
    },
  },
  dashboard: {
    autorenewClick: (packType: string): TrackingClickParams => {
      return {
        location: PageLocation.tile,
        buttonType: ButtonType.button,
        actions: [`autorenew_${APP_NAME}_${packType}`],
        actionType: 'action',
      };
    },
    resiliateClick: (packType: string): TrackingClickParams => {
      return {
        location: PageLocation.tile,
        buttonType: ButtonType.button,
        actions: [`delete_${APP_NAME}_${packType}`],
        actionType: 'action',
      };
    },
  },
} as const;
