import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  PageType,
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
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${PageType.dashboard}`,
        'metrics',
      ],
      actionType: 'action',
    },
  },

  apikey: {
    gotoApikeyClick: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${APP_NAME}`,
        `${PageType.listing}`,
      ],
      actionType: 'action',
    },
    createNewApikeyClick: {
      actions: [
        `${UNIVERSE}`,
        `${APP_NAME}`,
        PageLocation.page,
        `${ButtonType.button}`,
        'create_api-key',
        `${APP_NAME}`,
      ],
      actionType: 'action',
    },
    createNewApikeyPopUpShow: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${APP_NAME}`,
        `${PageLocation.popup}`,
        `create_api-key`,
      ],
      actionType: 'action',
    },

    confirmClick: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${PageLocation.popup}`,
        `create_api-key`,
        `confirm`,
      ],
      actionType: 'action',
    },
    successCreatApikeyPopUpShown: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${APP_NAME}`,
        `${PageLocation.popup}`,
        `create_api-key_success`,
      ],
      actionType: 'action',
    },
  },
} as const;
