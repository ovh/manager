import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';
import { APP_NAME, SUB_UNIVERSE, UNIVERSE, LEVEL2 } from './pci.constant';

export const PCI_LEVEL2 = '86';
export const PAGE_PREFIX = 'PublicCloud::pci::projects::project';
export const ACTION_PREFIX = `${PAGE_PREFIX}::ai-endpoints`;
export const DISCOVERY_PLANCODE = 'project.discovery';

export const TRACKING: Record<
  string,
  Record<string, TrackingClickParams | any>
> = {
  metrics: {
    gotometricsClick: {
      location: PageLocation.page,
      buttonType: ButtonType.tab,
      actions: [`metrics_${APP_NAME}`, `go-to-tab_${APP_NAME}`],
      actionType: 'action',
    },
  },

  apikey: {
    gotoApikeyClick: {
      location: PageLocation.page,
      buttonType: ButtonType.tab,
      actions: [`api-key_${APP_NAME}`],
      actionType: 'action',
    },
    createNewApikeyClick: {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actions: [`create_api-key_${APP_NAME}`],
      actionType: 'action',
    },
    createNewApikeyPopUpShow: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actions: [`${APP_NAME}_pop-up_create_api-key`],
      actionType: 'action',
    },

    confirmClick: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actions: [`create_api-key_${APP_NAME}_confirm`],
      actionType: 'action',
    },
    successCreatApikeyPopUpShown: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actions: [`${APP_NAME}_pop-up_api-key_success`],
      actionType: 'action',
    },
  },
} as const;
