import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  PageType,
  TrackingContextParams,
} from '@ovh-ux/manager-react-shell-client';

export const PCI_LEVEL2 = '86';
export const PAGE_PREFIX = 'PublicCloud::pci::projects::project';
export const ACTION_PREFIX = `${PAGE_PREFIX}::ai-endpoints`;
export const DISCOVERY_PLANCODE = 'project.discovery';
export const LEVEL2 = {
  EU: {
    config: {
      level2: '86',
    },
  },
  CA: {
    config: {
      level2: '86',
    },
  },
  US: {
    config: {
      level2: '86',
    },
  },
};
export const UNIVERSE = 'PublicCloud';
export const SUB_UNIVERSE = 'ai_machine_learning';
export const APP_NAME = 'ai_endpoints';

export const TRACKING: Record<
  string,
  Record<string, TrackingClickParams | any | TrackingContextParams>
> = {
  metrics: {
    tabClick: (
      tabname: string,
    ): TrackingClickParams | TrackingContextParams | any => {
      return {
        actions: [
          UNIVERSE,
          'ai_maching_learning',
          APP_NAME,
          'main-tabnav',
          `${tabname}`,
        ],
        actionType: 'action',
        appName: APP_NAME,
        pageTheme: UNIVERSE,
        level2: PCI_LEVEL2,
      };
    },

    gotometricsClick: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${PageType.dashboard}`,
        'metrics',
      ],
      actionType: 'action',
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
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
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
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
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
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
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
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
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
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
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
    },
  },
} as const;
